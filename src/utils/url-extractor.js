const urlExtractor = () => {
    const urls = Array.from(new Set(
        Array.from(document.querySelectorAll('*'))
            .flatMap(element => {
                const possibleUrls = [];
                if (element.src && (element.src.endsWith('.js') || element.src.endsWith('.json'))) {
                    possibleUrls.push(element.src);
                }
                if (element.href && (element.href.endsWith('.js') || element.href.endsWith('.json'))) {
                    possibleUrls.push(element.href);
                }
                return possibleUrls;
            })
    ));
    return urls;
};

export default urlExtractor;