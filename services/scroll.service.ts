export const scrollService = {
    toElement,
}

function toElement(id: string, offset: number) {
    setTimeout(() => {
        const y = document.getElementById(id)?.getBoundingClientRect()?.top + window.pageYOffset + offset;
        window.scrollTo({top: y, behavior: 'smooth'})
    }, 100)
}