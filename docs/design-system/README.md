# Project Brief: Lumina Notes Web App

## 1. Project Overview
Lumina Notes is a streamlined, productivity-focused note-taking web application. It combines a minimalist "Indigo Archive" aesthetic with functional features for capturing, organizing, and managing thoughts through a robust CRUD system and interactive tagging.

## 2. Core Requirements (CRUD)
The application supports the full lifecycle of a note:
- **Create:** Quickly capture new thoughts with a dedicated editor.
- **Read:** View a list of notes with summaries or dive into full detail views.
- **Update:** Edit existing titles, content, and metadata.
- **Delete:** Remove notes with a simple action.

## 3. Feature Specifications

### Note Metadata
- **Titles & Content:** Rich text or plain text support for body content.
- **Timestamps:** Automatic generation of 'Created' and 'Modified' dates using ISO 8601 format on the client side.

### Interactive Tagging System
- **Badge Display:** Tags appear as colorful badges at the bottom of notes.
- **Inline Addition:** Clicking a "+" button at the end of the tag list reveals an inline input field within a badge.
- **Validation:** 
    - **Uniqueness:** If a duplicate tag is entered, a Toast notification appears: *"이미 존재하는 태그입니다."* (This tag already exists.)
    - **Length:** Maximum 10 characters per tag.
- **Interaction Logic:**
    - **Enter:** Confirm and add tag.
    - **Esc / Blur:** Cancel tag addition/edit.
    - **Edit:** Clicking an existing tag badge transforms it back into an input field for inline editing.
    - **Delete:** A '×' button on each badge allows for quick removal.

## 4. User Experience & Design

### Visual Identity (Indigo Archive)
- **Primary Color:** Deep Indigo (#3f51b5).
- **Surface:** Soft neutrals and paper-like textures (#FAF9F6).
- **Typography:** Inter (Sans-serif) for high legibility.
- **Corner Radius:** Rounded 8px (Round Eight).

### Interface Structure
- **Global Navigation:** Bottom navigation bar for "Notes," "Archive," and "Settings."
- **List View:** Search bar at the top, followed by horizontal category filters (All, Work, Personal, Ideas) and vertical note cards.
- **Detail View:** Focus-oriented layout with integrated imagery and a clear tag section at the footer.
- **Editor:** A clean, distraction-free writing space with a floating formatting toolbar.

## 5. Technical Constraints
- **Device Support:** Primary focus on Mobile (Responsive Web).
- **Date Handling:** Client-side ISO 8601 generation for consistency across timezones.
- **State Management:** Immediate UI feedback for tagging interactions (Toasts and inline transitions).