import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import {
  Main,
  Board,
  LogIn,
  MyPage,
  Posting,
  LogInRedirectPage,
  RestaurantDetail,
  RestaurantListDetail,
  PrivacyPolicy,
  LocationPolicy,
} from "pages";
import { Layout } from "components";
import { PublicRoute, PrivateRoute, LocationProtectedRoute } from "routes";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Main />} />

      <Route element={<LocationProtectedRoute />}>
        <Route path="/board/:page?" element={<Board />} />
      </Route>

      <Route path="/detail/restaurant/:id?" element={<RestaurantDetail />} />
      <Route
        path="/detail/restaurantlist/:id?"
        element={<RestaurantListDetail />}
      />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LogIn />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/posting" element={<Posting />} />
        <Route path="/my-page/:page?" element={<MyPage />} />
      </Route>

      <Route path="/redirect" element={<LogInRedirectPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/location-policy" element={<LocationPolicy />} />
      <Route path="*" element={<div>404</div>} />
    </Route>
  )
);
