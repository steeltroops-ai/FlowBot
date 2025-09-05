# BiteSpeed Frontend Task: Chatbot flow builder

# Overview:

We’ll build a simple Chatbot flow builder using React and try to make the code extensible to easily add new features. 

A chatbot flow is built by connecting multiple messages together to decide the order of execution. 

*(double click on the images to enlarge)*

![Text node.jpeg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/75974f28-7e11-4222-b99f-83ae626dc6b8/Text_node.jpeg)

#**Note →** 

- Use https://reactflow.dev/ for the flow builder.
- You are free to use any other library on top of React Flow.
- You can use either of JavaScript or TypeScript for this Task
- Add comments to explain your code

# Features:

1. **Text Node** 
    1. Our flow builder currently supports only one type of message (i.e Text Message).
    2. There can be multiple Text Nodes in one flow.
    3. Nodes are added to the flow by dragging and dropping a Node from the Nodes Panel.
2. **Nodes Panel** 
    1. This panel houses all kind of Nodes that our Flow Builder supports.
    2. Right now there is only Message Node, but we’d be adding more types of Nodes in the future so make this section extensible 
3. **Edge**
    1. Connects two Nodes together
4. **Source Handle**
    1. Source of a connecting edge 
    2. Can only have **one edge** originating from a source handle
5. **Target Handle** 
    1. Target of a connecting edge
    2. Can have **more than one edge** connecting to a target handle 
6. **Settings Panel**
    
    ![Settings panel.jpeg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/38e424e4-01cd-462b-a4af-29de9d2c404c/Settings_panel.jpeg)
    
    1. Settings Panel will replace the Nodes Panel when a Node is selected
    2. It has a text field to edit text of the selected Text Node
7. **Save Button**
    1. Button to save the flow 
    2. **Save button press will show an error if there are more than one Nodes and more than one Node has empty target handles** 
        
        ![Screenshot 2022-10-24 at 10.41.29 PM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b33c6166-aa3e-4c1a-b1b8-1dbd010e1e2e/Screenshot_2022-10-24_at_10.41.29_PM.png)
        
    
    # Submission
    
    1. **Deploy** a working version on a **free hosting service** like Heroku, Vercel, etc 
    2. Host the **code repo on Github** and add hosting link from the above step to the **readme file** 
    3. **Please fill this form to submit the task**  
    
    [BiteSpeed - Frontend Task Submission](https://forms.gle/hsQBJQ8tzbsp53D77)Project Title
Chatbot Flow Builder – BiteSpeed Frontend Task

Project Description
a web-based chatbot flow builder where users can visually design chatbot conversations by connecting text message nodes on a canvas. the interface allows dragging and dropping nodes, connecting them with edges, editing node content, and validating flows before saving. the design follows a modern, minimal, apple-inspired aesthetic: clean canvas, card-like nodes, subtle shadows, smooth transitions, and contextual sidebars.

the flow builder is designed to be extensible, so new node types (like buttons, images, quick replies) can be added easily in the future.

Core Features

Canvas

infinite, pannable, zoomable space powered by reactflow

nodes positioned via drag and drop

smooth curved edges between nodes

Nodes

current version supports only text message nodes

each node is card-like, minimal, rounded edges, with source and target handles

handles:

source handle → one outgoing connection only

target handle → multiple incoming connections allowed

Nodes Panel

appears in the right sidebar when no node is selected

lists available node types (currently text node only)

drag and drop to add a node to canvas

Settings Panel

replaces nodes panel when a node is selected

editable text field to modify the node’s message

smooth panel transition with animation

Save Button & Validation

top-right header action

validates flow before saving

error: if more than one node has no outgoing edge, display error banner

Design & UX Philosophy

inspired by apple human interface guidelines

translucent header, contextual right sidebar, clean white canvas

nodes = soft cards with subtle shadows

animations subtle and purposeful (drag, panel transitions, hover highlights)

minimal distractions, focus on flow creation

Technical Stack

Frontend Framework: React 19

latest stable, hooks-based, concurrent rendering ready

react-dom for rendering, react-router (if needed) for navigation

Meta Framework: Next.js 15

routing, bundling with turbopack

hybrid SSR/CSR for fast page loads and SEO

Language: TypeScript

type safety, maintainable large codebase, ensures scalability

Flow Engine: React Flow (latest)

handles canvas, node rendering, edges, zoom, pan, drag/drop

State Management: Zustand

lightweight, unopinionated store

holds node data, edge connections, UI state (selected node, panel toggle)

UI & Styling:

Tailwind CSS for utility-first styling

shadcn/ui for modern, accessible, prebuilt components (buttons, panels, modals)

custom Apple-inspired theme: soft gray backgrounds, translucent header, rounded corners, subtle shadows

Animation: Framer Motion

smooth transitions for sidebar, hover scaling on nodes, edge drawing feedback

Error & Validation Handling: custom logic in save action

validates all nodes’ outgoing connections

error notifications appear as top banners, non-blocking

Deployment:

Vercel (first-class for Next.js apps)

GitHub repo linked to Vercel for auto-deploy on push

Development Approach

Component Structure

Canvas → houses reactflow instance

Node → custom node component (text node card)

Sidebar → conditionally renders nodes panel or settings panel

Header → app title, save button, error notification space

Extensibility

node types defined as a config (type, label, icon, default data)

new node types can be added without rewriting core logic

settings panel dynamically loads fields based on node type

User Flow

open app → empty canvas with sidebar (nodes panel)

drag text node to canvas → place anywhere

connect nodes with edges

select node → sidebar switches to settings → edit text

save flow → validation runs → if valid, store flow data


here’s how i’d break it down in applied terms:

header
thin, translucent with blur (like macos finder or safari tabs). minimal icons, maybe a logo at left, save button at right. font is clean, san francisco–style (or inter if you want web). hover states are subtle—slight opacity shift, no hard borders.

canvas
pure focus space. white or soft neutral gray background. flow nodes float like cards, with soft drop shadows and slightly rounded corners. drag interactions feel physics-based: a node gently eases into place when dropped. connectors (edges) have smooth, curved lines, not sharp angles, and animate slightly when being drawn.

nodes
each node = a card. think iOS widgets: rounded corners, clean typography, faint inner shadow. selected state glows subtly or adds a blue border highlight (apple’s accent color style). no clutter inside the node—just text and handles. handles should be minimal dots, with hover animations that expand softly so you know you can drag from them.

sidebar (nodes/settings)
right side panel slides in with smooth easing, not instant swap. if no node is selected: shows nodes panel (list of available nodes). when a node is selected: transitions to settings panel. background: subtle translucency or a flat light surface. icons and text are spaced with breathing room—never crowded.

save button / errors
save button top-right, prominent but minimal (filled pill or rounded button, blue accent). error messages appear as subtle banners sliding down from the top (like iOS notification banners), not big modals.

motion/interaction
framer motion (or motion one) handles smooth transitions. nodes slightly scale on hover, panels fade/slide with cubic-bezier curves (ease-in-out). nothing jerky, everything has intention.

design philosophy
apple design is about guiding focus. every extra line, border, and color is stripped away. depth comes from subtle shadows and layering, not gradients or clutter. the interface feels inevitable—everything where it should be, only what’s necessary, nothing more.

if you apply that to your flow builder, you end up with:

header: translucent, minimal, top aligned

main canvas: center stage, clean grid, drag-and-drop fluid

right sidebar: contextual, swapping smoothly between nodes list and node settings

nodes: card-like, rounded, airy, tactile

interactions: soft animations, immediate feedback, no harshness



Design Philosophy – Chatbot Flow Builder

our design foundation combines apple’s human interface principles with modern glassmorphism. the goal is to create a focused, minimal, elegant interface where every element has purpose. the ui should feel effortless, tactile, and alive without overwhelming the user.

core principles

clarity

everything visible should have a clear role. no extra borders, no visual noise.

text is legible, sharp, aligned, and has enough breathing room.

icons are simple, universal, with consistent stroke weight.

depth & layering

depth comes from layering, translucency, and shadows—not from heavy gradients.

panels and nodes float above the canvas, separated with soft blur and subtle shadows.

z-index order reflects hierarchy: header > sidebar > nodes > canvas.

focus through minimalism

show only what’s needed in context.

sidebar switches between nodes and settings automatically instead of cramming both.

node design is stripped back: text, handles, nothing else.

motion with meaning

every animation is functional, not decorative.

sidebar slides in/out with soft ease curves.

nodes scale slightly on hover → communicates interactivity.

edge drawing animates smoothly to show connection progress.

consistency

spacing, typography, corner radius, and shadow strength are consistent across the system.

use a fixed grid and spacing scale.

colors pulled from a limited palette: light neutrals, one accent (blue), subtle shadows.

glassmorphism rules

background surfaces

use frosted glass effects for panels (sidebar, header).

semi-transparent white/gray backgrounds with backdrop-filter: blur(16px) or similar.

subtle borders with low-opacity white to enhance the glass feel.

nodes

card-like with glass layers → semi-transparent with subtle blur.

soft shadows underneath to “lift” them off the canvas.

text remains solid (never translucent) for readability.

canvas

solid neutral background (white, off-white, or very light gray).

avoids blur to preserve focus on nodes.

edges and connections have consistent accent color (blue).

interactions

hover states increase glass brightness or shadow subtly.

selected node glows softly with accent color border.

sidebar transition preserves glass effect (sliding translucent panel).

typography

primary font: system-ui (on mac → San Francisco). fallback: Inter.

weights: regular for body, medium for labels, semibold for headings.

always left-aligned in panels, centered only when context demands (e.g. empty state).

use consistent hierarchy: heading > label > body.

colors

base: white (#ffffff), light gray (#f8f9fa).

glass overlays: rgba(255, 255, 255, 0.6) with blur.

accent: apple blue (#007aff).

text: near-black (#111) for body, medium gray (#555) for secondary labels.

shadows: rgba(0,0,0,0.1) soft, layered.

component behavior

header: translucent glass bar. actions aligned right (save). icons minimal.

sidebar: frosted glass card, edge-to-edge height. swaps smoothly between modes.

nodes: rounded cards, slight blur background, shadowed.

edges: curved bezier paths, animated while connecting.

buttons: rounded pill style, solid accent color, hover brightens slightly.

errors/notifications: slide-down translucent banners, never block workflow.

developer application

use tailwindcss with backdrop-blur and bg-white/60 for glass effects.

consistent corner radius: rounded-2xl across nodes, buttons, panels.

shadows: shadow-lg with subtle rgba tone.

animations: framer motion with easeInOut cubic-bezier.

typography: font-sans, font-medium, tracking-tight.

limit palette to accent + neutrals to preserve focus.