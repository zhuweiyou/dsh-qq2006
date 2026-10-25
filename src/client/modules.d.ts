/** PNG/GIF/CSS modules are resolved by the build (`dataurl` loader or inline module). */
declare module '*.png' {
  const url: string
  export default url
}

declare module '*.gif' {
  const url: string
  export default url
}

declare module '*.css' {
  const text: string
  export default text
}
