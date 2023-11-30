<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<nav>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/protected">Protected</a></li>
		{#if data.session}
			<li><a href="/auth/signout" data-sveltekit-preload-data="off">Sign Out</a></li>
		{/if}
	</ul>
</nav>
<slot />
