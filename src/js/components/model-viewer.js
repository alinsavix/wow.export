Vue.component('model-viewer', {
	props: ['context'],

	methods: {
		render: function() {
			if (!this.isRendering)
				return;
	
			this.renderer.render(this.context.scene, this.context.camera);
			requestAnimationFrame(() => this.render());
		}
	},

	/**
	 * Invoked when the component is mounted.
	 */
	mounted: function() {
		const container = this.$el;
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		const canvas = this.renderer.domElement;
		container.appendChild(canvas);

		this.onResize = () => {
			// We need to remove the canvas from the container so that the layout updates
			// correctly and then we can update the AR/canvas size based on that layout.
			container.removeChild(this.renderer.domElement);

			this.context.camera.aspect = container.clientWidth / container.clientHeight;
			this.context.camera.updateProjectionMatrix();
			this.renderer.setSize(container.clientWidth, container.clientHeight, false);

			// Add the canvas back now that we have the proper measurements applied.
			container.appendChild(this.renderer.domElement);
		};

		this.onResize();
		window.addEventListener('resize', this.onResize);

		this.isRendering = true;
		this.render();
	},

	/**
	 * Invoked when the component is destroyed.
	 */
	beforeDestroy: function() {
		this.isRendering = false;
		window.removeEventListener('resize', this.onResize);
	},

	/**
	 * HTML mark-up to render for this component.
	 */
	template: `<div class="ui-model-viewer"></div>`
});