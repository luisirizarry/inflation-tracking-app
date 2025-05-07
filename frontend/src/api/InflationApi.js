import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/** API Class for Inflation Tracker.
 *
 * Static class with methods for all API endpoints.
 * All frontend-API interaction should happen through this class.
 */

class InflationApi {
  static token = null;

  static setToken(token) {
    this.token = token;
  }

  static clearToken() {
    this.token = null;
  }

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const params = method === "get" ? data : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response?.data?.error?.message || "API request failed";
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Authentication

  static async login(data) {
    try {
      return (await this.request(`auth/token`, data, "post")).token;
    } catch (error) {
      console.error("API login error:", error);
      throw error;
    }
  }

  static async signup(data) {
    try {
      const result = await this.request(`auth/register`, data, "post");
      console.log("API signup response:", result);
      return result.token;
    } catch (error) {
      console.error("API signup error:", error);
      throw error;
    }
  }

  static async getUser(userId) {
    return (await this.request(`users/${userId}`)).user;
  }

  // Categories

  static async getCategories() {
    return (await this.request("categories")).categories;
  }

  static async getCategory(id) {
    return (await this.request(`categories/${id}`)).category;
  }

  static async getItemsByCategory(categoryId) {
    const result = await this.request(`categories/${categoryId}/items`);
    console.log("API raw response:", result); 
    return result;
  }

  // Tracked Items

  static async getItems() {
    return (await this.request("items")).trackedItems;
  }

  static async getItem(id) {
    return (await this.request(`items/${id}`)).trackedItem;
  }

  // NEW: Get item by FRED series ID
  static async getItemBySeriesId(seriesId) {
    return (await this.request(`items/series/${seriesId}`)).trackedItem;
  }

  // Inflation Data

  static async getLatestInflationData() {
    return (await this.request("inflation/latest")).data;
  }

  static async getItemInflationData(id) {
    return (await this.request(`inflation/${id}`)).data;
  }

  static async getInflationRange(id, startDate, endDate) {
    return (
      await this.request(`inflation/${id}/range`, {
        start: startDate,
        end: endDate,
      })
    ).data;
  }

  // User Preferences

  static async getUserPreferences(userId) {
    return (await this.request(`preferences/${userId}/preferences`))
      .preferences;
  }

  static async addPreference(userId, itemId, notify = true) {
    return (
      await this.request(
        `preferences/${userId}/preferences`,
        { trackedItemId: itemId, notify },
        "post"
      )
    ).preference;
  }

  static async updatePreference(userId, itemId, notify) {
    return (
      await this.request(
        `preferences/${userId}/preferences/${itemId}`,
        { notify },
        "patch"
      )
    ).preference;
  }

  static async removePreference(userId, itemId) {
    return (
      await this.request(
        `preferences/${userId}/preferences/${itemId}`,
        {},
        "delete"
      )
    ).deleted;
  }

  // Notifications

  static async getNotifications(userId) {
    return (await this.request(`notifications/${userId}`)).notifications;
  }

  static async markNotificationAsRead(id) {
    return (await this.request(`notifications/${id}/read`, {}, "patch"))
      .notification;
  }

  static async deleteNotification(id) {
    return (await this.request(`notifications/${id}`, {}, "delete")).deleted;
  }
}

export default InflationApi;
