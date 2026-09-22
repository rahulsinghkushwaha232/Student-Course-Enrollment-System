FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM eclipse-temurin:17-jdk AS backend-builder
WORKDIR /workspace
COPY StudentCourseEnrollmentSystem/ ./StudentCourseEnrollmentSystem/
COPY --from=frontend-builder /app/dist ./StudentCourseEnrollmentSystem/src/main/resources/static/
WORKDIR /workspace/StudentCourseEnrollmentSystem
RUN chmod +x mvnw && ./mvnw -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-builder /workspace/StudentCourseEnrollmentSystem/target/*.jar app.jar
COPY scripts/start.sh /app/start.sh
RUN chmod +x /app/start.sh
EXPOSE 8080
ENTRYPOINT ["/app/start.sh"]
