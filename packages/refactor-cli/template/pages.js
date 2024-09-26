export default [{
    id: "test",
    url: "https://npmjs.com",
    viewport: [1080, 1024],
    /**
     * @param {import('puppeteer').Page} page
     * @returns {Promise<void>}
     */
    setup: async (page) => {
    },
    pages: [
        {
            path: '/',
            id: 'landingpage',
            /**
             * @param {import('puppeteer').Page} page
             * @returns {Promise<void>}
             */
            setup: async (page) => {
            }
        },

    ]
}]