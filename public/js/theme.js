(function() {
    // --- darkenHex and lightenHex functions (keep as they are) ---
    function darkenHex(hex, factor) {
      hex = hex.replace("#", "");
      if (hex.length === 3) { hex = hex.split("").map(c => c + c).join(""); }
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);
      r = Math.max(0, Math.floor(r * (1 - factor)));
      g = Math.max(0, Math.floor(g * (1 - factor)));
      b = Math.max(0, Math.floor(b * (1 - factor)));
      return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
    }
  
    function lightenHex(hex, factor) {
      hex = hex.replace("#", "");
      if (hex.length === 3) { hex = hex.split("").map(c => c + c).join(""); }
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);
      r = Math.min(255, Math.floor(r + (255 - r) * factor));
      g = Math.min(255, Math.floor(g + (255 - g) * factor));
      b = Math.min(255, Math.floor(b + (255 - b) * factor));
      return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
    }
    // --- End darkenHex/lightenHex ---
  
    let theme = {
      primary: "#7100e3" // Default primary color
    };
    theme.primaryDark = darkenHex(theme.primary, 0.15);
    theme.secondary = lightenHex(theme.primary, 0.15);
  
    // Keep track of current Blob URLs to revoke them later
    let currentBlobUrls = {
      gradient: null,
      output: null
    };
  
    function updateCSSVariables() {
      document.documentElement.style.setProperty("--primary", theme.primary);
      document.documentElement.style.setProperty("--primary-dark", theme.primaryDark);
      document.documentElement.style.setProperty("--secondary", theme.secondary);
      // Note: SVG URL variables are updated in updateSVGs
    }
  
    /**
     * Fetches an SVG, replaces colors, creates a Blob URL,
     * and updates a CSS variable with the new URL.
     * Returns the new Blob URL.
     */
    async function updateSVGBackground(variableName, filePath, colorMap, oldBlobUrl) {
        try {
            // Revoke the previous blob URL for this variable to free up memory
            if (oldBlobUrl) {
                URL.revokeObjectURL(oldBlobUrl);
            }
  
            // Fetch the SVG file (add cache buster)
            const response = await fetch(filePath + '?v=' + Date.now());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${filePath}`);
            }
            let svgText = await response.text();
  
            // Replace colors based on the colorMap
            for (const [origColor, newColor] of Object.entries(colorMap)) {
                // Use RegExp for global, case-insensitive replacement. Escape '#' for regex.
                // Be mindful if hex codes could be substrings of others.
                const regex = new RegExp(origColor.replace('#', '\\#'), "gi");
                svgText = svgText.replace(regex, newColor);
            }
  
            // Create a Blob and generate a URL
            const blob = new Blob([svgText], { type: "image/svg+xml" });
            const newBlobUrl = URL.createObjectURL(blob);
  
            // Update the corresponding CSS variable with the new Blob URL
            // IMPORTANT: The value needs to be wrapped in url()
            document.documentElement.style.setProperty(variableName, `url(${newBlobUrl})`);
  
            // Return the new URL so we can track it
            return newBlobUrl;
  
        } catch (e) {
            console.error("Error updating SVG background for variable:", variableName, filePath, e);
            // Optional: Reset to default or do nothing
            // document.documentElement.style.setProperty(variableName, 'var(--default-svg-url)'); // Needs a default defined
            return oldBlobUrl; // Return the old URL on error to avoid revoking it unnecessarily next time
        }
    }
  
    // This function now needs to be async because it calls await
    async function updateSVGs() {
      // --- Define Your Color Mappings ---
      // IMPORTANT: Ensure these 'origColor' values EXACTLY match
      // the colors used in your actual SVG files.
  
      // Example mapping for output.svg (based on your provided SVG code)
      // Adjust these mappings based on how you want your theme colors applied
      let colorMapOutput = {
        "#7192e3": theme.secondary, // Example: Map the original light purple/blue to theme secondary
        "#5a74b5": theme.primary,   // Example: Map the next shade to theme primary
        "#435788": theme.primaryDark, // Example: Map the next shade to theme primary dark
        "#2d3a5a": darkenHex(theme.primaryDark, 0.1), // Make even darker variations
        "#161d2d": darkenHex(theme.primaryDark, 0.2),
        // Add/remove mappings as needed for output.svg
        // Original JS had: "#5a78c7": theme.primaryDark - Ensure this color exists or update map
      };
  
      // Example mapping for gradient.svg (based on your provided SVG code)
      let colorMapGradient = {
        "#1d2a3e": theme.primaryDark // Map the original dark blue/grey to theme primary dark
        // Add/remove mappings as needed for gradient.svg
      };
  
      // --- Update the CSS Variables ---
      // Pass the variable name, file path, color map, and the *current* blob URL
      currentBlobUrls.output = await updateSVGBackground('--output-svg-url', 'images/output.svg', colorMapOutput, currentBlobUrls.output);
      currentBlobUrls.gradient = await updateSVGBackground('--gradient-svg-url', 'images/gradient.svg', colorMapGradient, currentBlobUrls.gradient);
    }
  
    // Main initialization function
    async function initTheme(newPrimary) { // Make async
      if (newPrimary) {
        theme.primary = newPrimary;
        theme.primaryDark = darkenHex(newPrimary, 0.15);
        theme.secondary = lightenHex(newPrimary, 0.15);
      } else {
        // Ensure theme object is populated even if no newPrimary is passed on first run
        theme.primary = theme.primary || "##7192e3"; // Use default if needed
        theme.primaryDark = theme.primaryDark || darkenHex(theme.primary, 0.15);
        theme.secondary = theme.secondary || lightenHex(theme.primary, 0.15);
      }
  
      // Update standard color variables first
      updateCSSVariables();
  
      // Then, update the SVG backgrounds (which might use the theme colors)
      await updateSVGs(); // Wait for SVGs to be processed
    }
  
    // Expose the initTheme function globally
    window.initTheme = initTheme;
  
    // --- Initial Theme Load ---
    // Call initTheme() without an argument to use the default/initial theme colors
    // Or provide a color if loading from storage, etc. e.g., initTheme(localStorage.getItem('themeColor'))
    document.addEventListener('DOMContentLoaded', () => {
        // Ensure the DOM is ready before potentially interacting with elements (though we only touch :root here)
        initTheme(); // Use default theme defined above
    });
  
  })();