import React from "react";

/**
 * A React functional component that ensures content within it is centered, has the correct
 * background color, with and margin.
 *
 * @param props The content to be adjusted.
 *
 * @returns A React funcional component for ensuring content uniformity on different pages.
 */
const Container = (props: any) => {
    return (
        <div className="flex justify-center h-screen bg-white">
            <div className="w-full font-sans m-5">{props.children}</div>
        </div>
    );
};

export default Container;
