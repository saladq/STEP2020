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

import java.io.IOException;
import com.google.gson.Gson;
import java.util.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    
    ArrayList<String> items = new ArrayList<>();
    String item1 = "Hi ";
    String item2 = "there, ";
    String item3 = "I'm Sara!";
    items.add(item1);
    items.add(item2);
    items.add(item3);

    String json = new Gson().toJson(items);
    response.setContentType("application/json;");
    response.getWriter().println(json);
/*
    response.setContentType("text/html;");
    response.getWriter().println("<p>Hi there, I'm Sara!</p>");*/
  }
}
