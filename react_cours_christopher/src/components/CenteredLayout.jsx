import React from "react";

function CenteredLayout({ children }) {
    // Style flex pour centrer verticalement et horizontalement
    const layoutStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
        textAlign: "center", // si vous voulez aligner le texte au centre
    };

    return <div style={layoutStyle}>{children}</div>;
}

export default CenteredLayout;
