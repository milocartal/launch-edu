export const Easy: React.FC = () => {
    return (
        <div className="flex flex-row items-center justify-center">
            <div className="flex flex-row items-end">
                <svg width="7" height="11">
                    <rect width="7" height="11" className="fill-[#0E6073]" />
                </svg>
                <svg width="7" height="21" className="mx-1">
                    < rect width="7" height="21" className="fill-[#989898] dark:fill-[#2EA3A5]" />
                </svg >
                <svg width="7" height="30">
                    <rect width="7" height="30" className="fill-[#989898] dark:fill-[#2EA3A5]" />
                </svg >
            </div >
            <p className="ml-2 text-sm font-Inter text-[#989898] dark:text-[#2EA3A5]">débutant</p>
        </div>

    );
};

export const Med: React.FC = () => {
    return (
        <div className="flex flex-row items-center justify-center">
            <div className="flex flex-row items-end">
                <svg width="7" height="11">
                    <rect width="7" height="11" className="fill-[#0E6073]" />
                </svg>
                <svg width="7" height="21" className="mx-1">
                    < rect width="7" height="21" className="fill-[#0E6073]" />
                </svg >
                <svg width="7" height="30">
                    <rect width="7" height="30" className="fill-[#989898] dark:fill-[#2EA3A5]" />
                </svg >
            </div >
            <p className="ml-2 text-sm font-Inter text-[#989898] dark:text-[#2EA3A5]">intermédiaire</p>
        </div>

    );
};

export const Hard: React.FC = () => {
    return (
        <div className="flex flex-row items-center justify-center">
            <div className="flex flex-row items-end">
                <svg width="7" height="11">
                    <rect width="7" height="11" className="fill-[#0E6073]" />
                </svg>
                <svg width="7" height="21" className="mx-1">
                    < rect width="7" height="21" className="fill-[#0E6073]" />
                </svg >
                <svg width="7" height="30">
                    <rect width="7" height="30" className="fill-[#0E6073]" />
                </svg >
            </div >
            <p className="ml-2 text-sm font-Inter text-[#989898] dark:text-[#2EA3A5]">avancé</p>
        </div>

    );
};