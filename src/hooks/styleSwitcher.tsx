import React, { createContext, useCallback, useState, useContext, ReactNode } from 'react'
import isServer from '../utils/isServer';

interface StyleSwitcherProps {
    children: ReactNode;
}

interface StyleData {
    alias: string;
}

interface StyleSwitcherContextData {
    alias: String;
    switchAlias(alias: string): void;
}

const StyleSwitcherContext = createContext<StyleSwitcherContextData>({} as StyleSwitcherContextData);

const StyleSwitcherProvider: React.FC<StyleSwitcherProps> = ({ children }) => {
    const changeTheme = (flag: string) => {
        flag === 'dark'
            ? document.documentElement.classList.add('dark')
            : document.documentElement.classList.remove('dark');
    }

    const [data, setData] = useState<StyleData>(() => {
        if (isServer()) {
            return { alias: 'dark' };
        }

        const theme = localStorage.getItem('@DevFinder:theme');

        if (theme) {
            changeTheme(theme);
            return { alias: theme };
        }

        changeTheme('dark');
        return { alias: 'dark' };
    });

    const switchAlias = useCallback(() => {
        if (isServer()) return;

        const alias = data.alias === 'dark' ? 'light' : 'dark';

        setData({
            alias,
        });

        localStorage.setItem('@DevFinder:theme', alias);
        console.warn(alias);
        changeTheme(alias);
    }, [setData, data.alias])

    return (
        <StyleSwitcherContext.Provider value={{ alias: data.alias, switchAlias }}>
            {children}
        </StyleSwitcherContext.Provider>
    )
};

function useStyleSwitcher() {
    const context = useContext<StyleSwitcherContextData>(StyleSwitcherContext);

    return context;
}

export { StyleSwitcherProvider, useStyleSwitcher }
