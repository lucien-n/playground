<script lang="ts">
	import type { PageData } from './$types.js';

	export let data: PageData;
	export let form;
</script>

{#if form?.error}
	<p>{form.error}</p>
{/if}

{#if !data.session}
	<form action="/" method="post">
		<input type="text" placeholder="Username" name="username" value="Test" />
		<input type="password" placeholder="●●●●●●" name="password" value="test123" />
		<input type="submit" value="Login" />
	</form>
{:else}
	<h1>logged in</h1>
{/if}
