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
import com.google.appengine.api.datastore.Query.*;
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

@WebServlet("/likes")
public class LikesServlet extends HttpServlet {
  UserService userService;
  DatastoreService datastore;
  Query query;
  PreparedQuery results;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
      String commentId = request.getParameter("commentId");
      System.out.println("commentid: "+commentId);
      Long totalLikes = 0L;
      Long totalDislikes = 0L;
      
      Filter likeFilter = new FilterPredicate("likeType", FilterOperator.EQUAL, "like");
      Filter commentFilter = new FilterPredicate("commentId", FilterOperator.EQUAL, commentId);
      CompositeFilter likeCommentFilter = CompositeFilterOperator.and(likeFilter, commentFilter);
      query = new Query("likeInfo").setFilter(likeCommentFilter).setKeysOnly();
      System.out.println("first query: "+query);

      if(query != null)
      results = datastore.prepare(query);
      System.out.println("results: "+results);
//      List<Likes> likesUpdate = new ArrayList<>();

      for(Entity entity: results.asIterable()){
          if(entity != null)
          totalLikes++;
      }

      Filter dislikeFilter = new FilterPredicate("likeType", FilterOperator.EQUAL, "dislike");
      CompositeFilter dislikeCommentFilter = CompositeFilterOperator.and(dislikeFilter, commentFilter);
      query = new Query("likeInfo").setFilter(dislikeCommentFilter);
      results = datastore.prepare(query);
      System.out.println("second query: "+query);

      for(Entity entity: results.asIterable()){
          if(entity != null)
          totalDislikes++;
      }

      System.out.println("likes: "+totalLikes);

      Long res[] = {totalLikes, totalDislikes};

      Gson gson = new Gson();

      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(res));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    datastore = DatastoreServiceFactory.getDatastoreService();
    userService = UserServiceFactory.getUserService();

    if (!userService.isUserLoggedIn()) {
      response.sendRedirect("/index.html");
      return;
    }

    String commentId = request.getParameter("commentId");
    String userId = userService.getCurrentUser().getUserId();
    String likeType = request.getParameter("likeType");

    Filter userFilter = new FilterPredicate("userId", FilterOperator.EQUAL, userId);
    Filter commentFilter = new FilterPredicate("commentId", FilterOperator.EQUAL, commentId);

    CompositeFilter userCommentFilter =
        CompositeFilterOperator.and(userFilter, commentFilter);

    Query query = new Query("likeInfo").setFilter(userCommentFilter);

    PreparedQuery results = datastore.prepare(query);
    Entity ent = results.asSingleEntity();
    if(ent == null){
        Entity entity = new Entity("likeInfo");
        entity.setProperty("commentId", commentId);
        entity.setProperty("userId", userId);
        entity.setProperty("likeType", likeType);

        datastore.put(entity);

    } else if (ent.getProperty("likeType") != likeType){
        ent.setProperty("likeType", likeType);
        datastore.put(ent);
    } else {
        datastore.delete(ent.getKey());
        System.out.println("deleted");
    }
  }

}
