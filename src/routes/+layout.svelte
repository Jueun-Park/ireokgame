<script>
	import { base } from '$app/paths';
	import '../global.css';
</script>

<nav>
	<a href="{base}/">일억게임</a>
	<a href="{base}/rule">게임 방법</a>
</nav>

<slot />

<style>
	nav a {
		color: dimgray;
	}
</style>
