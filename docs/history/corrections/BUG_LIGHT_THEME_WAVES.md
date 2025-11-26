# BUG: Light Theme Wave Background Not Visible

## Problem
When switching to light theme, the wave background becomes invisible or shows as white/blank instead of displaying the same animated ocean gradient as the dark theme.

## Current Behavior
- **Dark theme**: Animated ocean gradient visible with smooth wave animation
- **Light theme**: White/blank background, no visible waves

## Expected Behavior
- **Light theme**: Should display the same animated ocean gradient as dark theme

## Root Cause
Multiple CSS selectors in different files are overriding the `.ocean-background` element:
1. `css/style.css` line ~1118: `body[data-theme="light"] .ocean-background` with light blue gradient
2. `css/themes.css`: May have conflicting styles
3. `css/splash.css`: Has theme-specific overrides

## Solution
Remove all theme-specific selectors for `.ocean-background` so both light and dark themes use the same base gradient defined in `css/style.css` (the default `.ocean-background` without theme selector).

### Files to Check/Fix
- `css/style.css` - Remove `body[data-theme="light"] .ocean-background` selector
- `css/splash.css` - Remove theme-specific wave background selectors
- `css/waves.css` - Ensure no theme-specific selectors exist
- `css/themes.css` - Verify no background overrides

### Implementation
1. Delete all `body[data-theme="light"] .ocean-background` selectors
2. Keep only the base `.ocean-background` selector that applies to both themes
3. Test that light theme shows the same waves as dark theme

## Testing
- Switch between light and dark themes
- Verify waves animate smoothly in both themes
- Verify no white/blank background appears in light theme
