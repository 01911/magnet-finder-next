import React, { Fragment, ReactNode } from 'react';

import { StyleSwitcherProvider, useStyleSwitcher } from './styleSwitcher';

interface AppProviderProps {
    children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return (
        <StyleSwitcherProvider>
            {children}
        </StyleSwitcherProvider>
    );
}

export default AppProvider;
