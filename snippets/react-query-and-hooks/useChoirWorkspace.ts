import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export interface ChoirMember {
  userId: string;
  roles: ("admin" | "moderator" | "member")[];
}

export interface ChoirWorkspaceAPI {
  choirId: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  inviteCode: string;
  users: ChoirMember[];
  songs: Array<{
    songId: string;
    title: string;
    composer?: string;
    labels: string[];
    voicing?: string;
  }>;
}

export interface ChoirContextValue {
  activeChoirId: string | null;
  choir: ChoirWorkspaceAPI | null;
  isLoading: boolean;
  error: Error | null;
  isAdmin: boolean;
  isModerator: boolean;
  switchWorkspace: (targetChoirId: string) => void;
}

export const ChoirContext = createContext<ChoirContextValue | undefined>(undefined);

/**
 * Standardized TanStack Query key factory for choir workspaces
 */
export const choirQueryKeys = {
  all: ["choirs"] as const,
  detail: (choirId: string | null) => ["choir", choirId] as const,
};

interface ChoirWorkspaceProviderProps {
  children: ReactNode;
  currentUserId: string;
  fetchChoirFn: (choirId: string) => Promise<ChoirWorkspaceAPI>;
}

/**
 * Choir Workspace Context Provider
 *
 * Synchronizes the active workspace ID with route parameters (`/choir/:choirId/*`),
 * orchestrates TanStack Query caching, and evaluates role-based capabilities in real time.
 */
export function ChoirWorkspaceProvider({
  children,
  currentUserId,
  fetchChoirFn,
}: ChoirWorkspaceProviderProps) {
  const { choirId: routeChoirId } = useParams<{ choirId?: string }>();
  const navigate = useNavigate();
  const [activeChoirId, setActiveChoirId] = useState<string | null>(routeChoirId || null);

  // Synchronize route changes with active workspace state
  useEffect(() => {
    if (routeChoirId && routeChoirId !== activeChoirId) {
      setActiveChoirId(routeChoirId);
    }
  }, [routeChoirId, activeChoirId]);

  // Fetch workspace details with TanStack Query
  const { data: choir, isLoading, error } = useQuery({
    queryKey: choirQueryKeys.detail(activeChoirId),
    queryFn: () => (activeChoirId ? fetchChoirFn(activeChoirId) : Promise.reject("No choir ID")),
    enabled: !!activeChoirId,
    staleTime: 5 * 60 * 1000, // 5 minutes fresh cache
  });

  // Calculate current user privileges for the active workspace
  const { isAdmin, isModerator } = useMemo(() => {
    if (!choir || !currentUserId) return { isAdmin: false, isModerator: false };
    const member = choir.users.find((u) => u.userId === currentUserId);
    if (!member) return { isAdmin: false, isModerator: false };

    return {
      isAdmin: member.roles.includes("admin"),
      isModerator: member.roles.includes("admin") || member.roles.includes("moderator"),
    };
  }, [choir, currentUserId]);

  const switchWorkspace = (targetChoirId: string) => {
    setActiveChoirId(targetChoirId);
    navigate(`/choir/${targetChoirId}`);
  };

  const contextValue: ChoirContextValue = {
    activeChoirId,
    choir: choir ?? null,
    isLoading,
    error: error as Error | null,
    isAdmin,
    isModerator,
    switchWorkspace,
  };

  return (
    <ChoirContext.Provider value={contextValue}>
      {children}
    </ChoirContext.Provider>
  );
}

/**
 * Custom hook to consume the active choir workspace context
 */
export function useChoirWorkspace(): ChoirContextValue {
  const context = useContext(ChoirContext);
  if (!context) {
    throw new Error("useChoirWorkspace must be used within a ChoirWorkspaceProvider");
  }
  return context;
}
