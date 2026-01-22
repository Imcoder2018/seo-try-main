#!/usr/bin/env python3
"""
Test script to demonstrate the improved penetrate.py functionality
"""

import os
import sys

# Add current directory to path to import penetrate_improved
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from penetrate_improved import parse_file_paths_from_text

def test_path_parsing():
    """Test the path parsing functionality with different input formats"""
    
    # Test input 1: Format from your first example
    test_input_1 = """
    Summary of Components Related to /content-strategy
    📄 Main Page (1 file)
    src/app/content-strategy/page.tsx - Main orchestrator component
    🎨 UI Components (4 files)
    src/components/content/content-strategy-dashboard.tsx - Main dashboard with 7 tabs
    src/components/content/PlannerView.tsx - Calendar with drag-and-drop
    src/components/content/HistoryPanel.tsx - Analysis history panel
    src/components/content/AutoContentEngine.tsx - Auto content generation
    🛠 API Endpoints (13 directories)
    /api/content/analyze/ - Content analysis
    /api/content/history/ - Analysis history
    /api/content/auto-plan/ - Calendar planning
    /api/content/schedule/ - Content publishing
    /api/content/generate/ - AI content generation
    /api/content/generate-outline/ - Content outlines
    /api/content/generate-image/ - AI images
    /api/content/bulk-generate/ - Bulk creation
    /api/content/sites/ - Website management
    /api/content/keywords/ - Keyword analysis
    /api/content/cron/ - Scheduled tasks
    /api/content/editor/ - Content editing
    /api/content/ai-topics/ - AI topic suggestions
    ⚙ Backend Tasks (4 files)
    trigger/content/content-analyzer.ts - Main analysis task
    trigger/content/content-extractor.ts - Content extraction
    trigger/content/content-generator.ts - AI generation
    trigger/content/auto-discovery.ts - Content discovery
    """
    
    # Test input 2: Format from your second example
    test_input_2 = """
    # Components Related to /content-strategy Page

    ## 📄 Main Page Component
    - **File**: `src/app/content-strategy/page.tsx` 
    - **Purpose**: Main page component that orchestrates the entire content strategy workflow

    ## 🎨 UI Components

    ### 1. ContentStrategyDashboard
    - **File**: `src/components/content/content-strategy-dashboard.tsx` 
    - **Purpose**: Main dashboard displaying content analysis results

    ### 2. PlannerView
    - **File**: `src/components/content/PlannerView.tsx` 
    - **Purpose**: Content calendar with drag-and-drop functionality

    ### 3. HistoryPanel
    - **File**: `src/components/content/HistoryPanel.tsx` 
    - **Purpose**: Displays historical content analyses

    ### 4. AutoContentEngine
    - **File**: `src/components/content/AutoContentEngine.tsx` 
    - **Purpose**: Automated content generation interface

    ## 🛠 API Endpoints

    ### Content Analysis APIs
    - **`/api/content/analyze/route.ts`** - Main content analysis endpoint
    - **`/api/content/history/route.ts`** - Fetches analysis history
    - **`/api/content/auto-plan/route.ts`** - Generates automated content plans
    - **`/api/content/schedule/route.ts`** - Content scheduling and publishing

    ### Content Generation APIs
    - **`/api/content/generate/route.ts`** - AI content generation
    - **`/api/content/generate-outline/route.ts`** - Content outline generation
    - **`/api/content/generate-image/route.ts`** - AI image generation
    - **`/api/content/bulk-generate/route.ts`** - Bulk content creation

    ### Content Management APIs
    - **`/api/content/sites/route.ts`** - Website management
    - **`/api/content/keywords/route.ts`** - Keyword analysis
    - **`/api/content/cron/route.ts`** - Scheduled content tasks
    - **`/api/content/editor/route.ts`** - Content editing operations

    ## ⚙ Backend Tasks (Trigger.dev)

    ### Content Processing Tasks
    - **`trigger/content/content-analyzer.ts`** - Main content analysis task
    - **`trigger/content/content-extractor.ts`** - Content extraction from websites
    - **`trigger/content/content-generator.ts`** - AI content generation
    - **`trigger/content/auto-discovery.ts`** - Automated content discovery
    """
    
    print("="*60)
    print("TESTING PATH PARSING FUNCTIONALITY")
    print("="*60)
    
    print("\nTest 1: First input format")
    print("-"*40)
    paths1 = parse_file_paths_from_text(test_input_1)
    print(f"Found {len(paths1)} paths:")
    for path in sorted(paths1):
        print(f"  - {path}")
    
    print("\n\nTest 2: Second input format")
    print("-"*40)
    paths2 = parse_file_paths_from_text(test_input_2)
    print(f"Found {len(paths2)} paths:")
    for path in sorted(paths2):
        print(f"  - {path}")
    
    # Check which paths actually exist
    print("\n\nChecking which files exist in the project:")
    print("-"*40)
    root_dir = os.getcwd()
    
    all_paths = set(paths1 + paths2)
    existing_files = []
    existing_dirs = []
    
    for path in all_paths:
        full_path = os.path.join(root_dir, path.replace('/', os.sep))
        if os.path.isfile(full_path):
            existing_files.append(path)
        elif os.path.isdir(full_path):
            existing_dirs.append(path)
    
    print(f"\nExisting files ({len(existing_files)}):")
    for path in sorted(existing_files):
        print(f"  ✓ {path}")
    
    print(f"\nExisting directories ({len(existing_dirs)}):")
    for path in sorted(existing_dirs):
        print(f"  📁 {path}")
    
    print(f"\nNon-existent paths ({len(all_paths) - len(existing_files) - len(existing_dirs)}):")
    for path in sorted(all_paths):
        if path not in existing_files and path not in existing_dirs:
            print(f"  ✗ {path}")

if __name__ == "__main__":
    test_path_parsing()
