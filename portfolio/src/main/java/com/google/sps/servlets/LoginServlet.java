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

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import com.google.sps.data.Info;
import com.google.gson.Gson;


@WebServlet("/login")
public class LoginServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
 //   PrintWriter out = response.getWriter();
    String url = "";
    boolean logged = false;
    String email = "";
    UserService userService = UserServiceFactory.getUserService();

    if (userService.isUserLoggedIn()) {
      logged = true;
      email = userService.getCurrentUser().getEmail();
      String urlToRedirectToAfterUserLogsOut = "/index.html#commentSection";
      url = userService.createLogoutURL(urlToRedirectToAfterUserLogsOut);
      
    } else {
      logged = false;
      email = "";
      String urlToRedirectToAfterUserLogsIn = "/index.html#log";
      url = userService.createLoginURL(urlToRedirectToAfterUserLogsIn);
    }

    Info info = new Info(logged, url, email);
    Gson gson = new Gson();

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(info));
  }
}
