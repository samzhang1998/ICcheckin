<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			this.scrollToTop();
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		onLoad() {
			this.reloadPage();
		},
		methods: {
            scrollToTop() {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            },
			reloadPage() {
				uni.redirectTo({
					url: getCurrentPageUrl()
				});
			}
        }
	}
</script>