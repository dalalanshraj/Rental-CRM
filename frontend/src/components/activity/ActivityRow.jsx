import ActivityCard from "./ActivityComposer";

export default function ActivityList({
  activities,
  loading,
  onUpdated,
  onDeleted,
}) {

  if (loading) {
    return (
      <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
        Loading activities...
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
        No activities found.
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {activities.map((activity) => (

        <ActivityCard
          key={activity._id}
          activity={activity}
          onUpdated={onUpdated}
          onDeleted={onDeleted}
        />

      ))}

    </div>
  );
}