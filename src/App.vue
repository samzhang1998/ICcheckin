<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			this.scrollToTop();
			this.reloadPage();
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
            scrollToTop() {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            },
			reloadPage() {
				const pages = getCurrentPages();
				const currentPage = pages[pages.length - 1];
				uni.reLaunch({
					url: '/' + currentPage.route
				});
			}
        }
	}
</script>