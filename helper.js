/**
 * Returns the max Value of the specified kind of case.
 * 
 * @param { {attributes:{cases_per_100k:number; cases7_per_100k:number; cases:number}}[] } data - The data with all the information about the corona cases
 * @param {"cases_per_100k" | "cases7_per_100k" | "cases"} kindOfCase - 
 */
export function getMax(data, kindOfCase) {
    let max = Number.MIN_VALUE;

    data.forEach(element => {
        if (element.attributes[kindOfCase] >= max) {
            max = element.attributes[kindOfCase];
        }
    })
    return (Math.ceil(max));
}

export function getPathFromCounty(county) {
    const paths = document.getElementsByTagName("path")
    for (var i = 0; i < paths.length; i++) {
        //Path = Selektierter  LK?
        if (paths[i].getAttribute('data-tooltip') === county) {
            return paths[i];
        }
    }
}

export function getKindOfCase() {
    let kindeOfCase = document.getElementsByName("whatIsShown");

    if (kindeOfCase[0].checked) {
        return "cases_per_100k"
    } else if (kindeOfCase[1].checked) {
        return "cases7_per_100k"
    } else if (kindeOfCase[2].checked) {
        return "cases"
    }
}
