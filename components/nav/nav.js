class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="links">
            <a href="/index.html">Home</a>
            <a href="/blog.html">Blog</a>
            <a href="/projects.html">Projects</a>
        </div>
    `;
    }
}

customElements.define('site-nav', NavBar);
