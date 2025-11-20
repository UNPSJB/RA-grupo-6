export function capitalizarCadena(cadena: string): string {
    cadena = cadena.toLocaleLowerCase()

    let cadenaCapitalizada = ""

    cadena.split(" ").forEach(subcadena => {
        cadenaCapitalizada = cadenaCapitalizada + " " + subcadena.charAt(0).toUpperCase() + subcadena.slice(1);
    });

    return cadenaCapitalizada
}

