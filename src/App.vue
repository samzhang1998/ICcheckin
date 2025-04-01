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
		methods: {
            scrollToTop() {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            }
        }
	}
</script>

<style>
	
</style>
