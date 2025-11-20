import { create } from "zustand";
import { matchingAPI } from "../api/endpoints";
import type { MatchCandidate, Match } from "../api/types";

interface MatchState {
  // Data
  candidates: MatchCandidate[];
  matches: Match[];
  currentIndex: number;

  // Loading states
  isLoading: boolean;
  isLoadingMatches: boolean;
  error: string | null;

  // Actions
  fetchCandidates: () => Promise<void>;
  fetchMatches: (status?: string) => Promise<void>;
  swipeRight: (candidateId: string, message?: string) => Promise<void>;
  swipeLeft: (candidateId: string) => Promise<void>;
  respondToMatch: (
    matchId: string,
    action: "accept" | "reject",
    message?: string
  ) => Promise<void>;
  nextCandidate: () => void;
  reset: () => void;
  clearError: () => void;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  // Initial state
  candidates: [],
  matches: [],
  currentIndex: 0,
  isLoading: false,
  isLoadingMatches: false,
  error: null,

  // Fetch candidates for matching
  fetchCandidates: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await matchingAPI.getCandidates(20, 0);
      set({
        candidates: response.data.candidates,
        currentIndex: 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al cargar candidatos",
        isLoading: false,
      });
    }
  },

  // Fetch user's matches
  fetchMatches: async (status = "all") => {
    set({ isLoadingMatches: true, error: null });
    try {
      const response = await matchingAPI.getMyMatches(status);
      set({
        matches: response.data.matches,
        isLoadingMatches: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al cargar matches",
        isLoadingMatches: false,
      });
    }
  },

  // Swipe right (like)
  swipeRight: async (candidateId: string, message?: string) => {
    try {
      const response = await matchingAPI.requestMatch(candidateId, message);

      // Remove candidate from list
      set((state) => ({
        candidates: state.candidates.filter((c) => c.id !== candidateId),
      }));

      // Add new match to matches list
      if (response.data.data?.match) {
        set((state) => ({
          matches: [response.data.data!.match, ...state.matches],
        }));
      }

      // Move to next candidate
      get().nextCandidate();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al procesar match",
      });
      throw error;
    }
  },

  // Swipe left (skip)
  swipeLeft: async (candidateId: string) => {
    try {
      await matchingAPI.skipCandidate(candidateId);

      // Remove candidate from list
      set((state) => ({
        candidates: state.candidates.filter((c) => c.id !== candidateId),
      }));

      // Move to next candidate
      get().nextCandidate();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al omitir candidato",
      });
      throw error;
    }
  },

  // Respond to match request (for mentors)
  respondToMatch: async (
    matchId: string,
    action: "accept" | "reject",
    message?: string
  ) => {
    try {
      const response = await matchingAPI.respondToMatch(
        matchId,
        action,
        message
      );

      // Update match in list
      set((state) => ({
        matches: state.matches.map((m) =>
          m.id === matchId
            ? { ...m, status: action === "accept" ? "active" : "rejected" }
            : m
        ),
      }));

      return response.data.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al responder match",
      });
      throw error;
    }
  },

  // Move to next candidate
  nextCandidate: () => {
    set((state) => ({
      currentIndex: state.currentIndex + 1,
    }));
  },

  // Reset state
  reset: () => {
    set({
      candidates: [],
      matches: [],
      currentIndex: 0,
      error: null,
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
