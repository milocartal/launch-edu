export function Difficulty (props:{level: number}){
    return(
        <div className="flex flex-row items-end">
            <svg width="7" height="11">
                <rect width="7" height="11" className="fill-[#0E6073]" />
            </svg>
            {props.level !== 1 ?
            <svg width="7" height="21" className="mx-1">
                <rect width="7" height="21" className="fill-[#0E6073]" />
            </svg > :
            <svg width="7" height="21" className="mx-1">
                <rect width="7" height="21" className="fill-[#989898] dark:fill-[#2EA3A5]" />
            </svg >}
            {props.level === 3 ?
            <svg width="7" height="30">
                <rect width="7" height="30" className="fill-[#0E6073]" />
            </svg > :
            <svg width="7" height="30">
                <rect width="7" height="30" className="fill-[#989898] dark:fill-[#2EA3A5]" />
            </svg >}
        </div >
    )
}

export function DifficultyText (props:{level: number}){
    return(
        <div className="flex flex-row items-center justify-center">
            <div className="flex flex-row items-end">
                <svg width="7" height="11">
                    <rect width="7" height="11" className="fill-[#0E6073]" />
                </svg>
                {props.level !== 1 ?
                <svg width="7" height="21" className="mx-1">
                    <rect width="7" height="21" className="fill-[#0E6073]" />
                </svg > :
                <svg width="7" height="21" className="mx-1">
                    <rect width="7" height="21" className="fill-[#989898] dark:fill-[#2EA3A5]" />
                </svg >}
                {props.level === 3 ?
                <svg width="7" height="30">
                    <rect width="7" height="30" className="fill-[#0E6073]" />
                </svg > :
                <svg width="7" height="30">
                    <rect width="7" height="30" className="fill-[#989898] dark:fill-[#2EA3A5]" />
                </svg >}
            </div >
            {props.level === 1 ? <p className="ml-2 text-sm font-Inter text-[#989898] dark:text-[#2EA3A5]">débutant</p> : props.level === 2 ? <p className="ml-2 text-sm font-Inter text-[#989898] dark:text-[#2EA3A5]">intermédiaire</p> : <p className="ml-2 text-sm font-Inter text-[#989898] dark:text-[#2EA3A5]">avancé</p>}
        </div>
    )
}