import { fetchTokens, type Token } from '../api/tokenService';

// Mutable export to maintain compatibility with "import { TOKENS } from ..."
// Consumers should call ensureTokensLoaded() or wait for app initialization
export const TOKENS: Token[] = [];

// Helper to load data into the array references
export const loadTokens = async () => {
    const fetched = await fetchTokens();
    // Update array in-place to preserve references
    TOKENS.length = 0;
    TOKENS.push(...fetched);
    return TOKENS;
};

