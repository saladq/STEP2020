// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

@WebServlet("/userInfo")
public class UserInfoServlet extends HttpServlet {
  UserService userService;
  DatastoreService datastore;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    userService = UserServiceFactory.getUserService();
    String name = "";
    String email = "";

    if (userService.isUserLoggedIn()){
        name = getUserName(userService.getCurrentUser().getUserId());
        email = userService.getCurrentUser().getEmail();
    }
    String[] res = {name, email};
    Gson gson = new Gson();

    response.setContentType("application/json");
    response.getWriter().println(gson.toJson(res));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    userService = UserServiceFactory.getUserService();

    if (!userService.isUserLoggedIn()) {
      response.sendRedirect("/index.html");
      return;
    }

    String username = request.getParameter("name");
    String id = userService.getCurrentUser().getUserId();
    String email = userService.getCurrentUser().getEmail();

    datastore = DatastoreServiceFactory.getDatastoreService();
    Entity entity = new Entity("UserInfo", id);
    entity.setProperty("id", id);
    entity.setProperty("name", username);
    entity.setProperty("email", email);
    // The put() function automatically inserts new data or updates existing data based on ID
    datastore.put(entity);

  //  response.sendRedirect("/home");
  }

  /**
   * Returns the nickname of the user with id, or empty String if the user has not set a nickname.
   */
  public String getUserName(String id) {
    datastore = DatastoreServiceFactory.getDatastoreService();
    Query query =
        new Query("UserInfo")
            .setFilter(new Query.FilterPredicate("id", Query.FilterOperator.EQUAL, id));
    PreparedQuery results = datastore.prepare(query);
    Entity entity = results.asSingleEntity();
    if (entity == null) {
      return "";
    }
    String name = (String) entity.getProperty("name");
    return name;
  }
}
