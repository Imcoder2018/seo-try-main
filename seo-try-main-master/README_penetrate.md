# Enhanced Project Codebase Generator

This is an improved version of the `penetrate.py` script that generates markdown documentation of your project's codebase with enhanced features for selective file processing.

## Features

### 1. Multiple Input Modes
- **Interactive Mode**: Choose between scanning all files or providing a custom list
- **Command Line Mode**: Use flags for quick operations
- **File Input Mode**: Read file/directory list from a text file

### 2. Smart Path Parsing
The script intelligently parses file paths from various input formats:
- Backtick enclosed paths: `src/app/page.tsx`
- Bullet point lists with file extensions
- Directory paths: src/components/content/
- API endpoints: /api/content/analyze/
- Trigger.dev task paths: trigger/content/analyzer.ts

### 3. **NEW** Intelligent Path Search
When a path is not found exactly, the script:
- Automatically searches for similar files in the project
- Handles API routes by looking in `src/app/api/` directories
- Finds content-strategy pages in common locations
- Tries different file extensions (.ts, .tsx, .js, .jsx)
- Shows you where it found matching files
- Reduces duplicates and prioritizes the best matches

### 4. Flexible Output
- Customizable output filename
- Proper syntax highlighting for multiple file types
- Clean markdown structure with table of contents

## Usage

### Interactive Mode
```bash
python penetrate_final.py
```
This will prompt you to choose between scanning all files or providing a custom list.

### Scan All Files
```bash
python penetrate_final.py --scan
```
Scans all files in the current directory (same as original script behavior).

### Read from File
```bash
python penetrate_final.py --input file_list.txt
```
Reads the list of files/directories from a text file.

### Custom Output File
```bash
python penetrate_final.py --scan --output my_project.md
```
Specifies a custom output filename.

## Input File Format

Create a text file with your file/directory list. The parser handles multiple formats:

```
# Example file_list.txt

# Backtick format
`src/app/page.tsx`
`src/components/ui/`

# Bullet points
- src/components/Header.tsx
- src/lib/utils.ts

# Plain list
src/styles/globals.css
public/favicon.ico

# API endpoints
/api/auth/login
/api/users/
```

## Intelligent Search Examples

The script can find files even if the path isn't exact:

```
Input: api/content/analyze/route.ts
Found: src/app/api/content/analyze/route.ts

Input: content-strategy/page.tsx
Found: src/app/content-strategy/page.tsx

Input: api/content/auto-plan
Found: src/app/api/content/auto-plan/route.ts
```

## Command Line Options

- `--help`: Show help message
- `--scan`: Scan all files (skip interactive mode)
- `--input, -i`: Read file/directory list from a file
- `--output, -o`: Specify output filename (default: PROJECT_CODEBASE.md)

## Examples

1. Generate documentation for specific components:
```bash
python penetrate_final.py --input components.txt -o components_docs.md
```

2. Quick full project scan:
```bash
python penetrate_final.py --scan
```

3. Interactive mode with custom output:
```bash
python penetrate_final.py -o project_snapshot.md
```

## Supported File Types

The script automatically detects and applies syntax highlighting for:
- TypeScript (.ts, .tsx)
- JavaScript (.js, .jsx)
- Python (.py)
- HTML (.html)
- CSS (.css)
- JSON (.json)
- Rust (.rs)
- Java (.java)
- C/C++ (.c, .cpp)
- Shell/Bash (.sh)
- Batch files (.bat)
- PHP (.php)

## Ignored Files/Directories

The script automatically ignores:
- Git directories (.git)
- Node modules (node_modules)
- Python cache (__pycache__)
- Environment files (.env)
- IDE folders (.idea, .vscode)
- Build directories (.next, dist, build)
- Documentation files (.md, .txt, .pdf)
- Image files (.png, .jpg, .gif, .svg)
- And more...

## Tips

1. Use backticks around file paths for most reliable parsing
2. The script automatically expands directories to include all files within
3. Wildcard patterns are supported (e.g., `src/**/*.tsx`)
4. Non-existent paths will trigger intelligent search
5. API routes are automatically mapped to `src/app/api/` structure
6. Duplicate paths are automatically filtered out

## Troubleshooting

- If no files are found, check that your paths are relative to the project root
- Use the `--scan` option to verify the basic functionality works
- Check that files aren't being ignored by the extension blacklist or .gitignore
- The intelligent search will help find files that are in different locations
- Build directories (.next, dist) are automatically ignored to speed up search
