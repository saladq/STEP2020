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

package com.google.sps;

import java.util.Collection;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.lang.Math;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
      Collection<String> attendees = request.getAttendees();
      Collection<String> optAttendees = request.getOptionalAttendees();
      ArrayList<TimeRange> attendeeTimes = new ArrayList<>();
      ArrayList<TimeRange> totAttendeeTimes = new ArrayList<>();
      Collection<TimeRange> res = new ArrayList<>();
      Collection<TimeRange> totRes = new ArrayList<>();

      long requestDuration = request.getDuration();

      // if duration of meeting longer than an entire day then not possible to schedule
      if(TimeRange.WHOLE_DAY.duration() < requestDuration) return res;

      // adding all time ranges where attendees are unavailable
      for(Event event: events){
          Collection<String> eventAttendees = event.getAttendees();
          if(!Collections.disjoint(attendees, eventAttendees)){
              attendeeTimes.add(event.getWhen());
              totAttendeeTimes.add(event.getWhen());
          } 
          else if(!Collections.disjoint(optAttendees, eventAttendees)){
              totAttendeeTimes.add(event.getWhen());
          }
      }
      
      // if no attendees or conflicts throughout day then not possible to schedule
      if ((attendees.size() <= 0 && optAttendees.size() <= 0) || totAttendeeTimes.size() <= 0){
          res.add(TimeRange.WHOLE_DAY);
          return res;
      }

      // check for available times of both mandatory and optional attendees
      if (totAttendeeTimes.size() >  0 ) totRes = openTimes(totAttendeeTimes, requestDuration);

      // return available times if not empty
      if(totRes.size() != 0){
          return totRes;
      }

      // otherwise return available times of just mandatory attendees
      if (attendeeTimes.size() > 0) res = openTimes(attendeeTimes, requestDuration);

      return res;
  }

  private static Collection<TimeRange> openTimes(ArrayList<TimeRange> attendeeTimes, long requestDuration){
      Collection<TimeRange> res = new ArrayList<>();
      Collections.sort(attendeeTimes, TimeRange.ORDER_BY_START);

      // check if beginning time of day is long enough to fit meeting
      TimeRange start = TimeRange.fromStartEnd(TimeRange.START_OF_DAY, attendeeTimes.get(0).start(), false);
      if((long)start.duration() >= requestDuration) res.add(start);
      
      TimeRange latestTime = attendeeTimes.get(0);

      // checking for open times to schedule meeting
      for(int i=1; i<attendeeTimes.size(); i++){
        TimeRange time = attendeeTimes.get(i);
        if (!time.overlaps(latestTime)){
            if(time.start()-latestTime.end() >= requestDuration){
                TimeRange timeOpen = TimeRange.fromStartDuration(latestTime.end(), time.start()-latestTime.end());
                res.add(timeOpen);
            }
        } 
        // update meeting that ends at the latest time
        if (latestTime.end() < time.end()) latestTime = time;
    
      }

      // check if ending time of day is long enough to fit meeting
      TimeRange end = TimeRange.fromStartEnd(latestTime.end(), TimeRange.END_OF_DAY, true);
      if((long)end.duration() >= requestDuration){
            res.add(end);
      }

      return res;
  }
}
