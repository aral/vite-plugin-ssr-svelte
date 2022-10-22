
export { onBeforeRender }

async function onBeforeRender(pageContext) {

  // await api data here
  const page = {
    title: "About",
    body: "Sample API prefetch page"
  };

  // pageProps is listed in server's passToClient list, so we put all of our
  // props into that, and just use that one prop.
  return {
    pageContext: {
      pageProps: {
        ...page
      }
    }
  }
}
