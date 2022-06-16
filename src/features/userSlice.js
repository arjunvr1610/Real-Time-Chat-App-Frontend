import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";

const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        addNotifications: (state, {payload}) => {
            if(state.newMessages[payload]) {
                state.newMessages[payload]++;
            } else {
                state.newMessages[payload] = 1;
            }
        },
        resetNotifications: (state, {payload}) => {
            delete state.newMessages[payload];
        }
    },
    
    extraReducers: (builder) => {
        // save user after signup
        builder.addMatcher(appApi.endpoints.signupUser.matchFulfilled, (state, {payload}) => payload);

        // save user after login
        builder.addMatcher(appApi.endpoints.loginUser.matchFulfilled, (state, {payload}) => payload);

        // destroy user session after logout
        builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, () => null);
    } 
});

export const { addNotifications, resetNotifications } = userSlice.actions;
export default userSlice.reducer;