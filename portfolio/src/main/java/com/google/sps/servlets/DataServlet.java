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

import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import java.io.IOException;
import com.google.gson.Gson;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.sps.data.Comment;


/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/updateComments")
public class DataServlet extends HttpServlet {

  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  PreparedQuery results;
  int max = 3;

  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    Query query = new Query("Task").addSort("timestamp", SortDirection.DESCENDING);

    results = datastore.prepare(query);
    System.out.println("current max:"+ max);

    List<Comment> comments = new ArrayList<>();

    for (Entity entity : results.asIterable(FetchOptions.Builder.withLimit(max))) {
        String name = (String) entity.getProperty("name");
        if (name == null || name == "") name = "Anonymous";

        String cmt = (String) entity.getProperty("comment");
        String date = (String) entity.getProperty("date");
        Comment c = new Comment(name, cmt, date);
        comments.add(c);
    }

    Gson gson = new Gson();

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(comments));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    String comment = request.getParameter("comment");
    String name = request.getParameter("name");

    LocalDateTime time = LocalDateTime.now();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    String date = time.format(formatter);

    long timestamp = System.currentTimeMillis();

    if(comment != null){
        Entity commentEntity = new Entity("Task");
        commentEntity.setProperty("name", name);
        commentEntity.setProperty("comment", comment);
        commentEntity.setProperty("date", date);
        commentEntity.setProperty("timestamp", timestamp);

        datastore.put(commentEntity);
    }

    if (request.getParameter("maxComments") != null && getMaxComments(request)!= -1) 
        max = getMaxComments(request);

    response.setContentType("text/html");
    response.getWriter().println("done");
    
  }

  private int getMaxComments(HttpServletRequest request) {
    // Get the input from the form.
    String maxComments = request.getParameter("maxComments");
    System.out.println("max: "+ maxComments);
    // Convert the input to an int.
    int max_num;

    try {
      max_num = Integer.parseInt(maxComments);
    } catch (NumberFormatException e) {
      System.err.println("Could not convert to int: " + maxComments);
      return -1;
    }

    return max_num;
  }
}
