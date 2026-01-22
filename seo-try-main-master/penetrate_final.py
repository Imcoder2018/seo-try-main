#!/usr/bin/env python3
"""
Enhanced Project Codebase Generator

This script generates a markdown file containing the project structure
and file contents. It supports multiple input modes:
1. Scan all files (default behavior)
2. Provide custom list of files/directories via stdin
3. Read from a file containing the list of files/directories

Usage:
    python penetrate_final.py                    # Interactive mode
    python penetrate_final.py --scan             # Scan all files
    python penetrate_final.py --input file.txt   # Read from file
    python penetrate_final.py --help             # Show help
"""

import os
import re
import pathspec
from pathlib import Path
import sys
import argparse

# --- CONFIGURATION ---
OUTPUT_FILE = "PROJECT_CODEBASE.md"

# Files extensions to ignore (Non-code files)
IGNORED_EXTENSIONS = {
    # Documentation & Text
    '.md', '.txt', '.rst', '.pdf', '.doc', '.docx', '.log', '.csv', '.bat',
    # Images & Media
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.ico', '.mp3', '.mp4',
    # Archives & Binaries
    '.zip', '.tar', '.gz', '.7z', '.rar', '.exe', '.dll', '.so', '.dylib', '.bin',
    # Compiled/Cache
    '.pyc', '.class', '.o', '.obj', '.db', '.sqlite', '.sqlite3'
}

# Directories to always ignore (in addition to .gitignore)
IGNORED_DIRS = {'.git', '__pycache__', 'node_modules', 'venv', '.env', '.idea', '.vscode', '.vercel', '.trigger'}

def load_gitignore(root_dir):
    """
    Loads .gitignore patterns from the root directory.
    """
    gitignore_path = os.path.join(root_dir, '.gitignore')
    if os.path.exists(gitignore_path):
        with open(gitignore_path, 'r') as f:
            return pathspec.PathSpec.from_lines('gitwildmatch', f)
    return None

def is_ignored(rel_path, spec):
    """
    Checks if a file matches .gitignore rules or our custom exclusion lists.
    """
    path_obj = Path(rel_path)
    
    # 1. Check strict directory excludes
    for part in path_obj.parts:
        if part in IGNORED_DIRS:
            return True

    # 2. Check extension blacklist
    if path_obj.suffix.lower() in IGNORED_EXTENSIONS:
        return True

    # 3. Check .gitignore (if it exists)
    if spec and spec.match_file(rel_path):
        return True

    return False

def parse_file_paths_from_text(text):
    """
    Parses file and directory paths from user input text.
    Handles various formats including:
    - Backtick paths: `src/app/page.tsx`
    - File patterns: **/route.ts
    - Directory paths: src/components/content/
    - Regular paths in text
    """
    paths = set()
    
    # Pattern 1: Backtick enclosed paths (most reliable)
    backtick_pattern = r'`([^`\n]+)`'
    backtick_matches = re.findall(backtick_pattern, text)
    for match in backtick_matches:
        if '/' in match or '\\' in match:
            paths.add(match.strip())
    
    # Pattern 2: File paths with extensions in list items
    # Look for lines that start with bullet points or have file patterns
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        
        # Skip if it's a header or description
        if line.startswith('#') or line.startswith('=') or not line:
            continue
        
        # Extract file paths from bullet points
        bullet_match = re.match(r'^[\s\-\*\•]*\**([^:\n]*\.(ts|tsx|js|jsx|py|html|css|json|rs|java|c|cpp|sh|bat|php))\**', line, re.IGNORECASE)
        if bullet_match:
            file_path = bullet_match.group(1).strip()
            # Clean up any trailing punctuation
            file_path = re.sub(r'[\*\_\-\—\–]+$', '', file_path)
            if len(file_path) > 5 and '/' in file_path:  # Basic validation
                paths.add(file_path)
        
        # Extract directory paths
        dir_match = re.match(r'^[\s\-\*\•]*\**([^:\n]*/[^:\n]*?)\**(\s|$)', line)
        if dir_match:
            dir_path = dir_match.group(1).strip()
            # Clean up
            dir_path = re.sub(r'[\*\_\-\—\–]+$', '', dir_path)
            dir_path = re.sub(r'\s+\d+\s*files?$', '', dir_path, flags=re.IGNORECASE)
            # Skip if it's an API endpoint without .ts or looks like a description
            if (len(dir_path) > 3 and 
                '/' in dir_path and 
                not dir_path.startswith('http') and 
                not '://' in dir_path and
                not dir_path.endswith('-') and
                not re.match(r'.*\s+(Main|Purpose|Features|Key|Component|Page|Dashboard|View|Panel|Engine)$', dir_path)):
                paths.add(dir_path.rstrip('/'))
    
    # Pattern 3: API endpoints - improved extraction
    # Look for patterns like /api/content/analyze/route.ts
    api_route_pattern = r'(/api/[\w\-/]+/route\.(ts|js))'
    api_route_matches = re.findall(api_route_pattern, text)
    for match in api_route_matches:
        paths.add(match[0])
    
    # Also capture API directory paths
    api_dir_pattern = r'(/api/[\w\-/]+)(?=\s|$|\))'
    api_matches = re.findall(api_dir_pattern, text)
    for match in api_matches:
        # Only add if it doesn't end with a word that suggests it's a description
        if not match.endswith(('-', ' ', '–', '—')) and not match.endswith('/route'):
            paths.add(match.strip())
    
    # Pattern 4: Trigger.dev task paths
    trigger_pattern = r'(trigger/[\w\-/]+\.ts)'
    trigger_matches = re.findall(trigger_pattern, text)
    for match in trigger_matches:
        paths.add(match.strip())
    
    # Pattern 5: Extract paths from code blocks
    code_block_pattern = r'```(?:text)?\s*\n([\s\S]*?)\n```'
    code_blocks = re.findall(code_block_pattern, text)
    for block in code_blocks:
        # Extract paths from tree-like structures
        for line in block.split('\n'):
            line = line.strip()
            # Match indented file paths
            match = re.match(r'^[│\s├└]*[\s─┬]*([\w/\\\-]+\.(ts|tsx|js|jsx|py|html|css|json))$', line)
            if match:
                paths.add(match.group(1))
    
    # Clean up paths
    cleaned_paths = set()
    for path in paths:
        # Remove common markdown artifacts and descriptions
        path = re.sub(r'[\*\_\`\[\]]+', '', path)
        path = re.sub(r'\s+\-\s+.*$', '', path)  # Remove descriptions after dash
        path = path.strip()
        
        # Normalize path separators
        path = path.replace('\\', '/')
        
        # Skip if too short or clearly not a path
        if (len(path) > 2 and 
            ('/' in path or '.' in path) and
            not path.startswith('#') and
            not path.startswith('Summary') and
            not path.startswith('Components') and
            not path.startswith('📄') and
            not path.startswith('🎨') and
            not path.startswith('🛠') and
            not path.startswith('⚙') and
            not path.startswith('📊') and
            not path.startswith('1.') and
            not path.startswith('→') and
            not path.startswith('├──') and
            not path.startswith('└──') and
            not 'Monthly/Weekly/Daily' in path and
            not 'appears to be a backup' in path):
            cleaned_paths.add(path)
    
    return list(cleaned_paths)

def find_file_similar(path, root_dir):
    """
    Searches for files with similar names when exact path is not found.
    Returns list of found file paths.
    """
    found_files = []
    filename = os.path.basename(path)
    
    # Special handling for API routes
    if path.startswith('api/content/'):
        # Remove the api/ prefix and add route.ts if needed
        api_path = path
        if not api_path.endswith('route.ts'):
            api_path = f"{api_path}/route.ts"
        
        # Convert to actual file path
        expected_path = f"src/app/{api_path}"
        full_path = os.path.join(root_dir, expected_path.replace('/', os.sep))
        if os.path.exists(full_path):
            found_files.append(expected_path)
        else:
            # Try to find the closest match
            api_name = path.replace('api/content/', '').replace('/route', '')
            search_pattern = f"src/app/api/**/*{api_name}*/route.ts"
            import glob
            matches = glob.glob(os.path.join(root_dir, search_pattern.replace('/', os.sep)), recursive=True)
            for match in matches[:3]:  # Limit to 3 matches
                rel_path = os.path.relpath(match, root_dir)
                found_files.append(rel_path.replace('\\', '/'))
        
        # If still not found, try exact name match in api/content directories
        if not found_files:
            search_pattern = f"src/app/api/content/**/route.ts"
            matches = glob.glob(os.path.join(root_dir, search_pattern.replace('/', os.sep)), recursive=True)
            for match in matches:
                rel_path = os.path.relpath(match, root_dir)
                # Check if this matches what we're looking for
                if api_name.replace('-', '') in rel_path.replace('-', '').replace('/', ''):
                    found_files.append(rel_path.replace('\\', '/'))
                    if len(found_files) >= 3:
                        break
        
        return found_files[:3]  # Return max 3 matches
    
    # Special handling for content-strategy paths
    if 'content-strategy' in path:
        if 'page.tsx' in path:
            expected_paths = [
                'src/app/content-strategy/page.tsx',
                'src/app/[domain]/content-strategy/page.tsx',
                'src/app/page.tsx'  # fallback
            ]
            for expected in expected_paths:
                full_path = os.path.join(root_dir, expected.replace('/', os.sep))
                if os.path.exists(full_path):
                    found_files.append(expected)
                    break
        return found_files
    
    # If path doesn't have an extension, try common extensions
    if '.' not in filename:
        possible_names = [
            filename + '.ts',
            filename + '.tsx',
            filename + '.js',
            filename + '.jsx',
            filename + '.py',
            filename + '.html',
            filename + '.css',
            filename + '.json',
        ]
    else:
        possible_names = [filename]
    
    # First, try to find exact path matches
    path_parts = path.split('/')
    for i in range(len(path_parts)):
        partial_path = '/'.join(path_parts[i:])
        full_path = os.path.join(root_dir, partial_path.replace('/', os.sep))
        if os.path.exists(full_path):
            rel_path = os.path.relpath(full_path, root_dir)
            if rel_path not in found_files:
                found_files.append(rel_path.replace('\\', '/'))
    
    # If no exact match, search by filename
    if not found_files:
        for root, dirs, files in os.walk(root_dir):
            # Skip ignored directories and build directories
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS and d != '.next']
            
            for file in files:
                # Check exact matches
                if file in possible_names:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, root_dir)
                    if rel_path not in found_files:
                        found_files.append(rel_path.replace('\\', '/'))
                        if len(found_files) >= 3:  # Limit results
                            return found_files
    
    return found_files[:3]  # Return max 3 matches

def expand_user_paths(user_paths, root_dir):
    """
    Expands user-provided paths (files and directories) to a list of files.
    """
    expanded_files = set()
    gitignore_spec = load_gitignore(root_dir)
    processed_paths = set()
    api_base_processed = set()  # Track API base paths to avoid duplicates
    
    for path in user_paths:
        # Normalize path
        path = path.replace('\\', '/')
        path = path.lstrip('./')  # Remove leading ./
        
        # Normalize API routes - remove leading slash for consistency
        if path.startswith('/') and 'api/' in path:
            path = path[1:]  # Remove leading slash
        
        # Skip if path is empty or just a slash
        if not path or path == '/':
            continue
        
        # Skip obvious non-paths
        if (path.startswith('1.') or path.startswith('→') or 
            path.startswith('├──') or path.startswith('└──') or
            path.startswith('@') or 'Monthly/Weekly/Daily' in path or
            'appears to be a backup' in path or path.endswith(')')):
            continue
        
        # Skip if we've already processed this path
        if path in processed_paths:
            continue
        processed_paths.add(path)
        
        # For API routes, avoid processing both base and route.ts
        if path.startswith('api/content/'):
            base_path = path.replace('/route.ts', '')
            if base_path in api_base_processed:
                continue
            api_base_processed.add(base_path)
        
        full_path = os.path.join(root_dir, path)
        
        if os.path.isfile(full_path):
            # It's a file
            rel_path = os.path.relpath(full_path, root_dir)
            if not is_ignored(rel_path, gitignore_spec):
                expanded_files.add(rel_path)
        elif os.path.isdir(full_path):
            # It's a directory - walk through it
            for dirpath, dirnames, filenames in os.walk(full_path):
                # Modify dirnames in-place to skip ignored directories
                dirnames[:] = [d for d in dirnames if d not in IGNORED_DIRS]
                
                for filename in filenames:
                    abs_path = os.path.join(dirpath, filename)
                    rel_path = os.path.relpath(abs_path, root_dir)
                    
                    # Skip the script itself and the output file
                    if filename == os.path.basename(__file__) or filename == OUTPUT_FILE:
                        continue
                    
                    if not is_ignored(rel_path, gitignore_spec):
                        expanded_files.add(rel_path)
        else:
            # Path not found - try intelligent search
            similar_files = find_file_similar(path, root_dir)
            if similar_files:
                # For API routes, prefer the most specific match
                if path.startswith('api/content/'):
                    # Sort by exact match score
                    similar_files.sort(key=lambda x: (
                        x.count('/content/') == 1,  # Prefer direct /content/ paths
                        x.count('/')  # Then prefer shorter paths
                    ), reverse=True)
                
                # Take the best match
                best_match = similar_files[0]
                print(f"Found '{path}' at: {best_match}")
                
                if not is_ignored(best_match, gitignore_spec):
                    expanded_files.add(best_match)
            else:
                print(f"Warning: Path not found: {path}")
    
    return list(expanded_files)

def scan_all_files(root_dir):
    """
    Scans all files in the directory (original behavior).
    """
    gitignore_spec = load_gitignore(root_dir)
    valid_files = []
    
    print(f"Scanning directory: {root_dir}...")
    
    # Walk through the directory
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Modify dirnames in-place to skip ignored directories efficiently
        dirnames[:] = [d for d in dirnames if d not in IGNORED_DIRS]
        
        # Also skip .git folder specifically if it wasn't caught
        if '.git' in dirnames:
            dirnames.remove('.git')

        for filename in filenames:
            abs_path = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(abs_path, root_dir)
            
            # Skip the script itself and the output file
            if filename == os.path.basename(__file__) or filename == OUTPUT_FILE:
                continue

            if not is_ignored(rel_path, gitignore_spec):
                valid_files.append(rel_path)
    
    return valid_files

def generate_tree(file_list):
    """
    Generates a directory tree string for the Table of Contents.
    """
    tree_str = "## 1. Project Structure\n\n```text\n"
    tree_str += ".\n"
    
    # Sort files to ensure folders come before files or alphabetical order
    file_list.sort()
    
    for path in file_list:
        parts = path.split(os.sep)
        indent = "    " * (len(parts) - 1)
        tree_str += f"{indent}├── {parts[-1]}\n"
        
    tree_str += "```\n\n"
    return tree_str

def get_file_content(filepath, rel_path):
    """
    Reads file content and returns formatted markdown block.
    """
    try:
        # Try reading as UTF-8
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Determine language for syntax highlighting
        ext = Path(filepath).suffix.lstrip('.')
        lang_map = {
            'py': 'python', 'js': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
            'jsx': 'javascript', 'html': 'html', 'css': 'css', 'json': 'json', 
            'rs': 'rust', 'java': 'java', 'c': 'c', 'cpp': 'cpp', 'sh': 'bash',
            'bat': 'batch', 'php': 'php'
        }
        lang = lang_map.get(ext, '')

        return (
            f"### {rel_path}\n\n"
            f"```{lang}\n"
            f"{content}\n"
            f"```\n\n"
            f"---\n\n"
        )
    except Exception as e:
        return f"> Error reading file {rel_path}: {str(e)}\n\n---\n\n"

def read_from_file(filename):
    """
    Reads file list from a file.
    """
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file '{filename}': {e}")
        sys.exit(1)

def get_user_input():
    """
    Gets user input for file selection mode.
    """
    print("\n" + "="*60)
    print("PROJECT CODEBASE GENERATOR")
    print("="*60)
    print("\nChoose mode:")
    print("1. Scan all files (default behavior)")
    print("2. Provide custom list of files/directories")
    
    while True:
        choice = input("\nEnter choice (1 or 2): ").strip()
        if choice in ['1', '2', '']:
            break
        print("Invalid choice. Please enter 1 or 2.")
    
    if choice == '1' or choice == '':
        return None
    
    # Mode 2: Get custom file list
    print("\n" + "-"*60)
    print("Paste your file/directory list below.")
    print("Supports various formats including:")
    print("- Backtick paths: `src/app/page.tsx`")
    print("- Directory paths: src/components/content/")
    print("- API endpoints: /api/content/analyze/")
    print("- File patterns: **/route.ts")
    print("-"*60)
    print("\nPaste your content (press Enter twice on empty line to finish):")
    
    lines = []
    empty_line_count = 0
    
    while True:
        try:
            line = input()
            if line.strip() == '':
                empty_line_count += 1
                if empty_line_count >= 2:
                    break
            else:
                empty_line_count = 0
                lines.append(line)
        except KeyboardInterrupt:
            print("\n\nOperation cancelled.")
            sys.exit(0)
    
    user_text = '\n'.join(lines)
    return user_text

def main():
    parser = argparse.ArgumentParser(
        description='Generate a markdown file containing project structure and file contents.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s                     # Interactive mode
  %(prog)s --scan              # Scan all files
  %(prog)s --input list.txt    # Read file list from list.txt
  %(prog)s -o output.md        # Specify output file
        """
    )
    
    parser.add_argument('--scan', action='store_true', 
                       help='Scan all files (skip interactive mode)')
    parser.add_argument('--input', '-i', type=str,
                       help='Read file/directory list from a file')
    parser.add_argument('--output', '-o', type=str, default=OUTPUT_FILE,
                       help=f'Output file name (default: {OUTPUT_FILE})')
    
    args = parser.parse_args()
    
    root_dir = os.getcwd()
    output_file = args.output  # Use local variable instead of modifying global
    
    # Determine input mode
    if args.input:
        # Read from file
        print(f"Reading file list from: {args.input}")
        user_input = read_from_file(args.input)
    elif args.scan:
        # Scan all files
        user_input = None
    else:
        # Interactive mode
        user_input = get_user_input()
    
    if user_input is None:
        # Mode 1: Scan all files
        valid_files = scan_all_files(root_dir)
    else:
        # Mode 2: Parse user input and expand paths
        print("\nParsing file paths from your input...")
        user_paths = parse_file_paths_from_text(user_input)
        
        if not user_paths:
            print("No valid file paths found in your input.")
            print("Falling back to scanning all files...")
            valid_files = scan_all_files(root_dir)
        else:
            print(f"\nFound {len(user_paths)} unique paths:")
            for path in sorted(user_paths)[:10]:  # Show first 10
                print(f"  - {path}")
            if len(user_paths) > 10:
                print(f"  ... and {len(user_paths) - 10} more")
            
            print("\nExpanding directories and finding files...")
            valid_files = expand_user_paths(user_paths, root_dir)
    
    print(f"\nTotal files to process: {len(valid_files)}")
    
    if not valid_files:
        print("No files found to process.")
        return
    
    # Write the Markdown file
    with open(output_file, 'w', encoding='utf-8') as md_file:
        md_file.write(f"# Project Codebase: {os.path.basename(root_dir)}\n\n")
        
        # Section 1: Table of Contents / Structure
        md_file.write(generate_tree(valid_files))
        
        # Section 2: File Contents
        md_file.write("## 2. File Contents\n\n")
        
        for rel_path in sorted(valid_files):
            abs_path = os.path.join(root_dir, rel_path)
            content_block = get_file_content(abs_path, rel_path)
            md_file.write(content_block)
            
    print(f"\nSuccessfully generated: {output_file}")

if __name__ == "__main__":
    main()
