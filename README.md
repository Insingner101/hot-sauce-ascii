# hot-sauce-ascii
Submission for hackenza
## Database Structure

-./
  - public
    - course_details
      - course_id
      - course_title
      - course_ic
      - course_type
      - course_faculties
      - grade_req
    - faculty_details
      - id
      - facukty_name
      - email_id
      - dept
      - course
      - role (hod, faculty, ic)
      - signature
    - fdcm_details
      - id
      - student_id
      - email_id
      - course_id
      - component
      - grade
      - recommendation
      - remark
      - signed_satus
    - form_details
      - id
      - student_id
      - name
      - course_id
      - grade
      - links
      - email_id
      - course_ic
      - email_status
    - user_details
      - email_id
      - role
      - id

## Note

- The id column in each table is a uuid for easy cross table linking and fetching of data.
- the structure mentioned above is of the form:
  -database
    -schema
      -table
        -table columns
