# PhotoMart - Canvas Art Application

A modern, aesthetic landing page for a canvas-selling application built with React and Framer Motion.

## Features

- **Modern Design**: Clean, minimal interface with the brand color #9242F1
- **Interactive Frames**: Three overlapping frames with image upload functionality
- **Smooth Animations**: Powered by Framer Motion for fluid interactions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Image Upload**: Users can upload images to each frame with drag-and-drop support
- **Animated Menu**: Three-dot toggle button that slides up a footer menu
- **Hover Effects**: Subtle animations and visual feedback on interactions

## Tech Stack

- **React 18**: Modern React with hooks
- **Framer Motion**: Smooth animations and transitions
- **CSS3**: Custom styling with modern features
- **Google Fonts**: Poppins font family for typography

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Features Breakdown

### Header
- Fixed header with three-dot menu button
- Smooth hover animations
- Backdrop blur effect

### Main Content
- Three overlapping frames (150x200px each)
- Left frame: rotated -8 degrees
- Center frame: straight (on top layer)
- Right frame: rotated 8 degrees
- Each frame supports image upload
- Hover effects with scale and shadow animations

### Image Upload
- Click "Choose Image" button on each frame
- Supports all image formats
- Real-time preview of uploaded images
- Placeholder content when no image is uploaded

### Footer Menu
- Slides up from bottom when three-dot button is clicked
- Three buttons: Collection, Custom Frames, Gifts
- Rounded pill design with brand colors
- Smooth spring animations

### Responsive Design
- Mobile-first approach
- Frames stack vertically on mobile
- Menu buttons stack on smaller screens
- Optimized touch interactions

## Color Palette

- **Primary**: #9242F1 (Purple)
- **Primary Dark**: #7a35d1 (Hover state)
- **Background**: White with subtle gradient
- **Text**: Dark gray (#333333)
- **Borders**: Light gray (#f0f0f0)

## Animation Features

- **Frame Hover**: Scale, rotation, and shadow effects
- **Menu Toggle**: Spring-based slide animation
- **Button Interactions**: Scale and color transitions
- **Floating Animation**: Subtle vertical movement for frames
- **Loading States**: Spinner animation for image uploads

## File Structure

```
src/
├── App.js          # Main application component
├── App.css         # Styles and animations
├── index.js        # React entry point
└── index.css       # Global styles
```

## Customization

### Changing Colors
Update the CSS custom properties in `App.css`:
- Primary color: `#9242F1`
- Background gradient: Modify the `background` property in `.app`

### Adding More Frames
1. Add new frame components in `App.js`
2. Update the `uploadedImages` state
3. Add corresponding CSS classes

### Modifying Animations
- Frame hover effects: Modify `whileHover` props in motion components
- Menu animations: Adjust `transition` properties
- Timing: Update `duration` values in CSS animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized animations using Framer Motion
- Efficient image handling with FileReader API
- Responsive images with proper sizing
- Minimal bundle size

## Future Enhancements

- Drag and drop image upload
- Image editing capabilities
- Frame customization options
- Shopping cart functionality
- User authentication
- Backend integration

## License

This project is open source and available under the MIT License. 