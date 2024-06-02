<script>
    import wwlogo from "$lib/media/wwlogo.svg";
</script>

<footer>
    <hr width="100%" />
    <a href="https://instagram.com/wholesomewarestuff" target="_blank">
        <div class="wwlogo" style="font-family: Capriola-Regular;">
            <img src={wwlogo} alt="WholesomeWare logo" width="24" />
            WholesomeWare
        </div>
    </a>
</footer>

<style>
    footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
    }

    a {
        text-decoration: none;
    }

    .wwlogo {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: 0.5rem;
        padding: .5rem 1rem;
        background-color: white;
        color: black;
        border-radius: 2rem;
    }
</style>
