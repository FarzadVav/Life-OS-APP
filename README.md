# **Life OS (Arrow Up)**

Personal operating system for moving up and managing daily momentum, reflective journals, and life architecture.

## **Features & Architecture**

### **1. Todos & Missions**
- **Home Page (`/`)**:
  - **Today (Daily)**: Time-scheduled recurring and daily focus items with completion tracking.
  - **Upcoming**: Scheduled future target dates with calendar pickers.
  - **Missions**: Multi-step strategic objectives with Time and Energy Cost ratings (1-5), milestone actions with status toggles, and real-time progress bars.
- **Unified Creator (`/todos/new`)**:
  - Dynamically configures fields according to item type (Daily -> time picker, Upcoming -> day picker, Mission -> day picker + Time and Energy Cost select + actions milestone builder).

### **2. Journals**
- **Journals Page (`/journals`)**:
  - Filterable by 6 immutable categories: **Logs**, **Thoughts**, **Feelings**, **Lessons**, **Ideas**, **Notes**.
- **Journal Creator (`/journals/new`)**:
  - Category selector, title, and rich text entry powered by TipTap editor.

### **3. Framework**
- **Framework Page (`/framework`)**:
  - Icon: `Layers`
  - 8 immutable categories: **Career**, **Mindset**, **Social**, **Health**, **Behavior**, **Finance**, **Lifestyle**, **Knowledge**.
  - 3 structured sections per category:
    1. **Visions**: Long-term mastery and destination.
    2. **Rules**: Non-negotiable principles and operational boundaries.
    3. **Concepts**: Deep mental models, timeless insights, and playbooks.
  - Interactive cards opening rich text inspection drawers with editing and deletion support.
- **Framework Item Creator (`/framework/new`)**:
  - Title input, category selector, section selector, and full TipTap Rich Text Editor.
