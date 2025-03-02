import { Routes } from "@angular/router";
import { SwPeopleFetchListPageComponent } from "./pages/people/sw-people-fetch-list-page/sw-people-fetch-list-page.component";
import { SwPeoplePageComponent } from "./pages/people/sw-people-page/sw-people-page.component";
import { SwPageComponent } from "./pages/sw-page/sw-page.component";
import { SwPersonViewPageComponent } from "./pages/people/sw-person-view-page/sw-person-view-page.component";
import { SwPeopleHttpClientListPageComponent } from "./pages/people/sw-people-http-client-list-page/sw-people-http-client-list-page.component";
import { SwPeopleHttpResourceListPageComponent } from "./pages/people/sw-people-http-resource-list-page/sw-people-http-resource-list-page.component";

export default [
  {
  path: '',
  component: SwPageComponent,
  children: [
  { path: '', redirectTo: 'people', pathMatch: 'full' },
  {
  path: 'people',
  component: SwPeoplePageComponent,
  children: [
  { path: '', redirectTo: 'fetch', pathMatch: 'full' },
  { path: 'fetch', component: SwPeopleFetchListPageComponent },
  { path: 'http-client', component: SwPeopleHttpClientListPageComponent },
  { path: 'resource-client', component: SwPeopleHttpResourceListPageComponent },
  { path: ':id', component: SwPersonViewPageComponent },
  ],
  },
  ],
  },
  ] as Routes;
