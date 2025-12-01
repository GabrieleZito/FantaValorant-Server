# Server

-   [x] togliere login con passport
-   [] aggiungere più info nel payload del jwt
-   [] aggiungere più cose nella response del refresh (expiresIn, user, ...)
-   [x] nella query per i tornei compaiono anche gli showmatch
-   [x] aggiungere check quotidiano per aggiornare i tournaments
-   [x] aggiungere check quotidiano placemments
-   [] aggiungere check quotidiano matches
-   [x] aggiungere check quotidiano teams
-   [x] aggiungere check quotidiano players
-   [] il nome della serie è uguale per tornei in anni diversi, quindi va fatto il controllo sulla data
-   [x] (optional) data del controllo daily di ieri
-   [] aggiungere controllo se i loghi esistono già prima di riscaricarli
-   [] aggiungere check change sui player
-   [] TYLOO ha il nome duplicato per due team
-   [] togliere gli l'array results negli scheduler
-   [] considerare di cambiare getPlayerByPagename con objectname
-   [] aggiungere foreign key in players per i team
-   [] aggiungere check duplicati in updateMatches per sicurezza
-   [] i tournaments possono avere null come enddate, controllo su getNextTournaments
-   [] aggiungere filter a get /tournaments/series
-   [] updating placements righe eliminate più di quelle aggiunte

# Client

-   [x] errore in dynamic breadcrumb quando apre pagine friends
-   [] sistemare i colori per la dark mode
-   [x] finire di impostare persistent login anche nelle pagine publiche
-   [] lettura del payload dei jwt nel client
-   [] aggiungere remember me
-   [] velocizzare caricamento font e img bg pagina login
-   [x] sistemare pagina inviti
-   [x] chi manda la richiesta di amicizia vede se stesso come amico
-   [x] aggiungere controllo se l'asta è già cominciata
-   [] sistemare visualizzazione inviti se il nome della league è troppo lungo
-   [] cambiare il controllo sulla pagina dell'asta in socket, senza isSuccess
