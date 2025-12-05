import { useCallback, useContext } from "react";
import { GameContext } from "../context/GameContext";

// Simple sound URLs (using free placeholders or generic sounds)
const SOUNDS = {
    click: "https://cdn.freesound.org/previews/256/256116_3263906-lq.mp3", // Simple click
    success: "https://cdn.freesound.org/previews/270/270402_5123851-lq.mp3", // Success chime
    error: "https://cdn.freesound.org/previews/142/142608_1840739-lq.mp3", // Error buzz
    confetti: "https://cdn.freesound.org/previews/391/391539_5121236-lq.mp3" // Party horn
};

export default function useSound() {
    const { soundEnabled } = useContext(GameContext);

    const play = useCallback((name) => {
        if (!soundEnabled) return;

        const url = SOUNDS[name];
        if (url) {
            const audio = new Audio(url);
            audio.volume = 0.5;
            audio.play().catch(e => console.warn("Audio play failed", e));
        }
    }, [soundEnabled]);

    return play;
}
