import { z } from 'zod';

export const TokenSchema = z.object({
    currency: z.string(),
    date: z.string(),
    price: z.number()
});

export type TokenData = z.infer<typeof TokenSchema>;

export interface Token extends TokenData {
    icon: string;
    symbol: string;
    name: string;
}

const tokenModules = import.meta.glob('../assets/tokens/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

export const fetchTokens = async (): Promise<Token[]> => {
    let rawData: any[] = [];

    try {
        const response = await fetch('https://interview.switcheo.com/prices.json');
        if (!response.ok) {
            console.error(`[TokenService] Network response was not ok: ${response.status} ${response.statusText}`);
            throw new Error('Failed to fetch tokens');
        }

        const json = await response.json();

        const parsed = z.array(TokenSchema).safeParse(json);

        if (parsed.success) {
            console.log("[TokenService] Successfully fetched and validated token data.");
            rawData = parsed.data;
        } else {
            console.error("[TokenService] Validation Failed!", parsed.error);
            return [];
        }

    } catch (error) {
        console.error("[TokenService] Fetch Request Failed:", error);
        return [];
    }

    try {

        const uniqueTokensMap = new Map<string, TokenData>();

        rawData.forEach(token => {
            const existing = uniqueTokensMap.get(token.currency);
            if (!existing || new Date(token.date) > new Date(existing.date)) {
                uniqueTokensMap.set(token.currency, token);
            }
        });

        const tokens: Token[] = Array.from(uniqueTokensMap.values()).map(token => {
            let iconName = token.currency;

            if (token.currency === 'STEVMOS') iconName = 'stEVMOS';
            if (token.currency === 'RATOM') iconName = 'rATOM';
            if (token.currency === 'STOSMO') iconName = 'stOSMO';
            if (token.currency === 'STATOM') iconName = 'stATOM';
            if (token.currency === 'STLUNA') iconName = 'stLUNA';

            const match = Object.keys(tokenModules).find(key => key.includes(`/${iconName}.svg`));

            return {
                ...token,
                icon: match ? tokenModules[match] : '',
                symbol: token.currency,
                name: token.currency
            };
        });

        return tokens;
    } catch (processError) {
        console.error("Error processing token data:", processError);
        return [];
    }
};
