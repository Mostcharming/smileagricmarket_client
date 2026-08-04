// Static font definitions referencing CSS variables defined in app/globals.css
// This avoids network calls to fonts.googleapis.com during next build.
export const bricolage = {
  variable: "--font-bricolage",
};

export const inter = {
  variable: "--font-inter",
};

export const jetbrainsMono = {
  variable: "--font-jetbrains",
};

export const fontVariables = `${inter.variable} ${bricolage.variable} ${jetbrainsMono.variable}`;

