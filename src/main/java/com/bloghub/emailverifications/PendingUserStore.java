package com.bloghub.emailverifications;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class PendingUserStore {

    private static final Map<String, PendingUser> STORE = new ConcurrentHashMap<>();

    public static void save(String email, PendingUser pendingUser) {
        STORE.put(email, pendingUser);
    }

    public static PendingUser get(String email) {
        return STORE.get(email);
    }

    public static void remove(String email) {
        STORE.remove(email);
    }
}
