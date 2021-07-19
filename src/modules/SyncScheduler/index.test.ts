import SynchronousIntervalScheduler from "./index";

describe("Test SyncScheduler", () => {
  // Improvements: Longer run time with test for average accuracy,
  // Removing and adding subscribers
  test("Scheduler should call subscribers", async (done) => {
    const sis = SynchronousIntervalScheduler.getInstance();
    let counter100 = 0;
    let counter10 = 0;
    sis.addListener([100], () => (counter100 += 1));
    sis.addListener([10], () => (counter10 += 1));

    setTimeout(() => {
      expect(counter100).toBeGreaterThanOrEqual(1);
      expect(counter10).toBeGreaterThanOrEqual(5);

      sis.shutdown();
      done();
    }, 140);
  });
});
