import { columns } from "@/components/columns";
import { DataTable } from "@/components/DataTable";
import { Task, taskSchema } from "@/components/DataTableRowActions";
import { useEffect, useState } from "react";
import { z } from "zod";

const ProductListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/task.json");
        const tasks = await response.json();
        const validatedTasks = z.array(taskSchema).parse(tasks);
        setTasks(validatedTasks || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      }
    }
    fetchTasks();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      List - Product page!
      <DataTable data={tasks} columns={columns} />
    </div>
  );
};

export default ProductListPage;
