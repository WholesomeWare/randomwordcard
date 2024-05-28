<script>
    import wwlogo from "$lib/media/wwlogo.svg";
</script>

<hr>
<footer>
    <div class="wwlogo" style="font-family: Capriola-Regular;">
        <img src={wwlogo} alt="WholesomeWare logo" width="24" />
        WholesomeWare
    </div>
</footer>

<style>
    footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
    }

    .wwlogo {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: 0.5rem;
    }
</style>